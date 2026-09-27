import { padStart } from 'lodash-es';
import { beforeEach, describe, expect, it } from 'vitest';

import { PLAYED_WORLDS_KEPT, STORAGE_KEY } from './consts';
import { loadSave } from './load-save';
import { listPlayableWorlds } from './list-playable-worlds';
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
  replay: { worldName: name, steps: 1, entries: [[0, 1]] },
});

const savedBy = (earlier: unknown): void => {
  store.set(STORAGE_KEY, JSON.stringify(earlier));
};

describe('the worlds a player has played', () => {
  beforeEach(() => store.clear());

  it('should remember the world when it is played for the first time', () => {
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(0));

    expect(loadSave().playedWorlds).toEqual([
      { name: 'ABC', day: '2026-08-16', playedAt: at(0), runs: 1 },
    ]);
  });

  it('should keep the day the world was built from when it records a world', () => {
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(0));

    expect(listPlayableWorlds(loadSave())[0].day).toBe('2026-08-16');
  });

  it('should count a second run rather than list the world twice when the same world is played again', () => {
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(0));
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(5));

    const [world] = loadSave().playedWorlds;
    expect(loadSave().playedWorlds).toHaveLength(1);
    expect(world.runs).toBe(2);
    expect(world.playedAt, 'and remembers the latest visit').toBe(at(5));
  });

  it('should put the world at the top of the list when it was played most recently', () => {
    recordPlayedWorld({ name: 'OLD', day: '2026-08-10' }, at(0));
    recordPlayedWorld({ name: 'NEW', day: '2026-08-11' }, at(5));

    expect(listPlayableWorlds(loadSave()).map((world) => world.name)).toEqual([
      'NEW',
      'OLD',
    ]);
  });

  it('should let go of the oldest worlds when the shelf is full', () => {
    for (let index = 0; index < PLAYED_WORLDS_KEPT + 10; index++) {
      recordPlayedWorld({ name: `W${index}`, day: '2026-08-16' }, at(index));
    }
    const played = loadSave().playedWorlds;

    expect(played).toHaveLength(PLAYED_WORLDS_KEPT);
    expect(played[0].name, 'the first ten dropped off').toBe('W10');
  });

  it('should show the world once with its score alongside when it has been finished', () => {
    savedBy({ score: 5, completedWorlds: [completed('ABC', '2026-08-16')] });
    recordPlayedWorld({ name: 'ABC', day: '2026-08-16' }, at(0));

    const worlds = listPlayableWorlds(loadSave());
    expect(worlds).toHaveLength(1);
    expect(worlds[0].completed?.score).toBe(100);
  });

  it('should take the world as played too when it was finished before records were kept', () => {
    savedBy({ score: 5, completedWorlds: [completed('OLD', '2026-01-01')] });

    const [world] = listPlayableWorlds(loadSave());
    expect(world.name).toBe('OLD');
    expect(world.day, 'an old save can still be replayed').toBe('2026-01-01');
    expect(world.completed).not.toBeNull();
  });

  it('should come back with no played worlds when the save was written before they were kept', () => {
    savedBy({ score: 7 });

    expect(loadSave().playedWorlds).toEqual([]);
    expect(listPlayableWorlds(loadSave())).toEqual([]);
  });
});
