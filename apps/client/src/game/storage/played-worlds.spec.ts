import { padStart } from 'lodash-es';
import { beforeEach, describe, expect, it } from 'vitest';

import { PLAYED_WORLDS_KEPT, STORAGE_KEY } from './consts';
import { loadSave } from './load-save';
import { playableWorlds } from './playable-worlds';
import { recordPlayedWorld } from './record-played-world';
import type { CompletedWorld } from './save-data';

const store = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): void => void store.set(key, value),
    removeItem: (key: string): void => void store.delete(key),
  },
  configurable: true,
});

const at = (seconds: number): string =>
  `2026-08-16T10:00:${padStart(String(seconds), 2, '0')}Z`;

const completed = (name: string, day: string): CompletedWorld => ({
  name,
  day,
  score: 100,
  seconds: 42,
  runId: '',
  replay: { worldName: name, entries: [[0, 1]] },
});

const savedBy = (earlier: unknown): void => {
  store.set(STORAGE_KEY, JSON.stringify(earlier));
};

describe('the worlds a player has played', () => {
  beforeEach(() => store.clear());

  it('remembers a world the first time it is played', () => {
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(0));

    expect(loadSave().playedWorlds).toEqual([
      { name: 'ABC', day: '2026-08-16', playedAt: at(0), runs: 1 },
    ]);
  });

  it('keeps the day, which is all it takes to build the world again', () => {
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(0));

    expect(playableWorlds(loadSave())[0].day).toBe('2026-08-16');
  });

  it('counts a second run rather than listing the world twice', () => {
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(0));
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(5));

    const [world] = loadSave().playedWorlds;
    expect(loadSave().playedWorlds).toHaveLength(1);
    expect(world.runs).toBe(2);
    expect(world.playedAt, 'and remembers the latest visit').toBe(at(5));
  });

  it('puts the world played most recently at the top of the list', () => {
    recordPlayedWorld({ name: 'OLD', day: '2026-08-10' }, at(0));
    recordPlayedWorld({ name: 'NEW', day: '2026-08-11' }, at(5));

    expect(playableWorlds(loadSave()).map((world) => world.name)).toEqual([
      'NEW',
      'OLD',
    ]);
  });

  it('lets go of the oldest worlds once the shelf is full', () => {
    for (let index = 0; index < PLAYED_WORLDS_KEPT + 10; index++) {
      recordPlayedWorld({ name: `W${index}`, day: '2026-08-16' }, at(index));
    }
    const played = loadSave().playedWorlds;

    expect(played).toHaveLength(PLAYED_WORLDS_KEPT);
    expect(played[0].name, 'the first ten dropped off').toBe('W10');
  });

  it('shows a finished world once, with its score alongside', () => {
    savedBy({ score: 5, completedWorlds: [completed('ABC', '2026-08-16')] });
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(0));

    const worlds = playableWorlds(loadSave());
    expect(worlds).toHaveLength(1);
    expect(worlds[0].completed?.score).toBe(100);
  });

  it('takes worlds finished before it kept records as played too', () => {
    savedBy({ score: 5, completedWorlds: [completed('OLD', '2026-01-01')] });

    const [world] = playableWorlds(loadSave());
    expect(world.name).toBe('OLD');
    expect(world.day, 'an old save can still be replayed').toBe('2026-01-01');
    expect(world.completed).not.toBeNull();
  });

  it('reads a save written before any of this existed', () => {
    savedBy({ score: 7 });

    expect(loadSave().playedWorlds).toEqual([]);
    expect(playableWorlds(loadSave())).toEqual([]);
  });
});
