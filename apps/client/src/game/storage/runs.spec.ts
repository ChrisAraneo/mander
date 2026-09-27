import type { PackedReplay } from '@mander/engine';
import { map, padStart, size, times } from 'lodash-es';
import { beforeEach, describe, expect, it } from 'vitest';

import { archiveRun, type FinishedRun } from './archive-run';
import { RUNS_KEPT, STORAGE_KEY } from './consts';
import { loadSave } from './load-save';
import { listPlayableWorlds } from './list-playable-worlds';
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
  steps: length * 4,
  entries: times(length, (index) => [index * 4, 0]),
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
  listPlayableWorlds(loadSave()).find((world) => world.name === name)
    ?.replays ?? [];

describe('the runs a player has archived', () => {
  beforeEach(() => {
    store.clear();
    roomLeft = Number.POSITIVE_INFINITY;
  });

  it('should keep the replay when the run ended in death', () => {
    archiveRun(run(), at(0));

    const [kept] = loadSave().runs;
    expect(kept.outcome).toBe('GAME_OVER');
    expect(kept.levelIndex, 'and how far the run got').toBe(2);
    expect(kept.replay.entries, 'with the replay intact').toHaveLength(2);
  });

  it('should keep every run when a world has been played several times', () => {
    archiveRun(run({ score: 500 }), at(0));
    archiveRun(run({ score: 10 }), at(1));
    archiveRun(run({ score: 300 }), at(2));

    expect(map(loadSave().runs, 'score')).toEqual([500, 10, 300]);
  });

  it('should offer the runs newest first when a world is listed', () => {
    archiveRun(run(), at(0));
    archiveRun(run(), at(1));
    archiveRun(run(), at(2));

    expect(map(replaysOf('ABC'), 'playedAt')).toEqual([at(2), at(1), at(0)]);
  });

  it('should file the run as the world record and list it once when the run was finished', () => {
    archiveRun(run({ outcome: 'COMPLETE', score: 900, seconds: 61 }), at(0));

    const [world] = loadSave().completedWorlds;
    const [kept] = loadSave().runs;
    expect(world.score).toBe(900);
    expect(world.runId, 'pointing at the run it came from').toBe(kept.id);
    expect(replaysOf('ABC'), 'so the run is not offered twice').toHaveLength(1);
  });

  it('should still offer the best run when it has scrolled off the list', () => {
    archiveRun(run({ outcome: 'COMPLETE', score: 900 }), at(0));
    times(RUNS_KEPT, (index) =>
      archiveRun(run({ name: 'ZZZ' }), at(index + 1)),
    );

    expect(loadSave().runs, 'the run itself is gone').toHaveLength(RUNS_KEPT);
    expect(map(replaysOf('ABC'), 'id'), 'but the world kept its best').toEqual([
      'ABC:best',
    ]);
  });

  it('should let go of the oldest run when the shelf is full', () => {
    times(RUNS_KEPT + 5, (index) => archiveRun(run(), at(index)));

    const kept = loadSave().runs;
    expect(kept).toHaveLength(RUNS_KEPT);
    expect(kept[0].playedAt, 'the first five dropped off').toBe(at(5));
  });

  it('should list the run when its world has fallen out of the played worlds', () => {
    archiveRun(run({ name: 'LOST', day: '2026-01-01' }), at(0));

    const [world] = listPlayableWorlds(loadSave());
    expect(world.name).toBe('LOST');
    expect(world.day, 'the day is all it takes to rebuild it').toBe(
      '2026-01-01',
    );
    expect(world.replays).toHaveLength(1);
  });

  it('should shed the oldest replays rather than lose the save when there is no room left', () => {
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

  it('should tell the runs apart when two of them ended in the same instant', () => {
    archiveRun(run());
    archiveRun(run());

    expect(loadSave().runs, 'neither overwrites the other').toHaveLength(2);
  });

  it('should come back with no runs when the save was written before runs were archived', () => {
    store.set(STORAGE_KEY, JSON.stringify({ score: 7 }));

    expect(loadSave().runs).toEqual([]);
    expect(listPlayableWorlds(loadSave())).toEqual([]);
  });

  it('should drop the archived run when its replay did not survive the trip', () => {
    store.set(
      STORAGE_KEY,
      JSON.stringify({ runs: [{ id: 'A', name: 'ABC' }, { id: 'B' }] }),
    );

    expect(loadSave().runs).toEqual([]);
  });
});
