import type { PackedReplay } from '@mander/engine';
import { map, padStart, size, times } from 'lodash-es';
import { beforeEach, describe, expect, it } from 'vitest';

import { archiveRun, type FinishedRun } from './archive-run';
import { RUNS_KEPT, STORAGE_KEY } from './consts';
import { loadSave } from './load-save';
import { playableWorlds } from './playable-worlds';
import { recordPlayedWorld } from './record-played-world';
import type { RunRecord } from './save-data';

const store = new Map<string, string>();
let roomLeft = Number.POSITIVE_INFINITY;

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      if (size(value) > roomLeft) {
        throw new Error('QuotaExceededError');
      }
      store.set(key, value);
    },
    removeItem: (key: string): void => void store.delete(key),
  },
  configurable: true,
});

const at = (minute: number): string =>
  `2026-09-04T10:${padStart(String(minute), 2, '0')}:00Z`;

const replayOf = (name: string, length = 2): PackedReplay => ({
  worldName: name,
  entries: times(length, (index) => [index * 16, 0, 1 / 60]),
});

const run = (patch: Partial<FinishedRun> = {}): FinishedRun => ({
  name: 'ABC',
  day: '2026-09-04',
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: replayOf(patch.name ?? 'ABC'),
  ...patch,
});

const replaysOf = (name: string): RunRecord[] =>
  playableWorlds(loadSave()).find((world) => world.name === name)?.replays ??
  [];

describe('the runs a player has archived', () => {
  beforeEach(() => {
    store.clear();
    roomLeft = Number.POSITIVE_INFINITY;
  });

  it('keeps the replay of a run that ended in death', () => {
    archiveRun(run(), at(0));

    const [kept] = loadSave().runs;
    expect(kept.outcome).toBe('GAME_OVER');
    expect(kept.levelIndex, 'and how far the run got').toBe(2);
    expect(kept.replay.entries, 'with the replay intact').toHaveLength(2);
  });

  it('keeps every run of a world, not only the best one', () => {
    archiveRun(run({ score: 500 }), at(0));
    archiveRun(run({ score: 10 }), at(1));
    archiveRun(run({ score: 300 }), at(2));

    expect(map(loadSave().runs, 'score')).toEqual([500, 10, 300]);
  });

  it('offers a world its runs newest first', () => {
    archiveRun(run(), at(0));
    archiveRun(run(), at(1));
    archiveRun(run(), at(2));

    expect(map(replaysOf('ABC'), 'playedAt')).toEqual([at(2), at(1), at(0)]);
  });

  it('files a finished run as the world record too, and lists it once', () => {
    archiveRun(run({ outcome: 'COMPLETE', score: 900, seconds: 61 }), at(0));

    const [world] = loadSave().completedWorlds;
    const [kept] = loadSave().runs;
    expect(world.score).toBe(900);
    expect(world.runId, 'pointing at the run it came from').toBe(kept.id);
    expect(replaysOf('ABC'), 'so the run is not offered twice').toHaveLength(1);
  });

  it('can still play the best run once it scrolls off the list', () => {
    archiveRun(run({ outcome: 'COMPLETE', score: 900 }), at(0));
    times(RUNS_KEPT, (index) =>
      archiveRun(run({ name: 'ZZZ' }), at(index + 1)),
    );

    expect(loadSave().runs, 'the run itself is gone').toHaveLength(RUNS_KEPT);
    expect(map(replaysOf('ABC'), 'id'), 'but the world kept its best').toEqual([
      'ABC:best',
    ]);
  });

  it('lets go of the oldest run once the shelf is full', () => {
    times(RUNS_KEPT + 5, (index) => archiveRun(run(), at(index)));

    const kept = loadSave().runs;
    expect(kept).toHaveLength(RUNS_KEPT);
    expect(kept[0].playedAt, 'the first five dropped off').toBe(at(5));
  });

  it('lists a run whose world fell out of the played worlds', () => {
    archiveRun(run({ name: 'LOST', day: '2026-01-01' }), at(0));

    const [world] = playableWorlds(loadSave());
    expect(world.name).toBe('LOST');
    expect(world.day, 'the day is all it takes to rebuild it').toBe(
      '2026-01-01',
    );
    expect(world.replays).toHaveLength(1);
  });

  it('sheds the oldest replays rather than losing the save', () => {
    recordPlayedWorld({ name: 'ABC', day: '2026-09-04' }, at(0));
    roomLeft = 9_000;
    times(6, (index) =>
      archiveRun(run({ replay: replayOf('ABC', 200) }), at(index)),
    );

    const save = loadSave();
    expect(size(save.runs), 'only what fits is kept').toBeLessThan(6);
    expect(size(save.runs), 'and the newest still is').toBeGreaterThan(0);
    expect(save.playedWorlds, 'while the rest of the save survives').toEqual([
      { name: 'ABC', day: '2026-09-04', playedAt: at(0), runs: 1 },
    ]);
  });

  it('tells apart two runs that ended in the same instant', () => {
    archiveRun(run());
    archiveRun(run());

    expect(loadSave().runs, 'neither overwrites the other').toHaveLength(2);
  });

  it('reads a save written before runs were archived', () => {
    store.set(STORAGE_KEY, JSON.stringify({ score: 7 }));

    expect(loadSave().runs).toEqual([]);
    expect(playableWorlds(loadSave())).toEqual([]);
  });

  it('drops an archived run whose replay did not survive the trip', () => {
    store.set(
      STORAGE_KEY,
      JSON.stringify({ runs: [{ id: 'A', name: 'ABC' }, { id: 'B' }] }),
    );

    expect(loadSave().runs).toEqual([]);
  });
});
