import type { PackedReplay } from '@mander/engine';
import { constant, map, padStart, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { RUNS_KEPT } from './consts';
import { readSave } from './read-save';
import type { FinishedRun } from './types/finished-run';
import { writeRun } from './write-run';

const RANDOM = constant(0.5);

const formatPlayedAt = (minute: number): string =>
  `2026-09-04T10:${padStart(String(minute), 2, '0')}:00Z`;

const createReplay = (name: string, length = 2): PackedReplay => ({
  worldName: name,
  steps: length * 4,
  entries: times(length, (index) => [index * 4, 0]),
});

const createRun = (patch: Partial<FinishedRun> = {}): FinishedRun => ({
  name: 'ABC',
  day: '2026-09-04',
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: createReplay(patch.name ?? 'ABC'),
  ...patch,
});

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
    removeItem: (key: string): boolean => store.delete(key),
  }) as unknown as Storage;

describe('writeRun', () => {
  it('should keep the replay when the run ended in death', () => {
    const storage = createStorage(new Map());

    writeRun(createRun(), formatPlayedAt(0), RANDOM, storage);

    const [kept] = readSave(storage).runs;
    expect(kept.outcome).toBe('GAME_OVER');
    expect(kept.levelIndex, 'and how far the run got').toBe(2);
    expect(kept.replay.entries, 'with the replay intact').toHaveLength(2);
  });

  it('should keep every run when a world has been played several times', () => {
    const storage = createStorage(new Map());

    writeRun(createRun({ score: 500 }), formatPlayedAt(0), RANDOM, storage);
    writeRun(createRun({ score: 10 }), formatPlayedAt(1), RANDOM, storage);
    writeRun(createRun({ score: 300 }), formatPlayedAt(2), RANDOM, storage);

    expect(map(readSave(storage).runs, (run) => run.score)).toEqual([
      500, 10, 300,
    ]);
  });

  it('should file the run as the world record when the run was finished', () => {
    const storage = createStorage(new Map());

    writeRun(
      createRun({ outcome: 'COMPLETE', score: 900, seconds: 61 }),
      formatPlayedAt(0),
      RANDOM,
      storage,
    );

    const { completedWorlds, runs, score } = readSave(storage);
    expect(completedWorlds[0].score).toBe(900);
    expect(completedWorlds[0].runId, 'pointing at the run it came from').toBe(
      runs[0].id,
    );
    expect(score, 'and the score it reached').toBe(900);
  });

  it('should keep the better world record when a later finished run scores less', () => {
    const storage = createStorage(new Map());

    writeRun(
      createRun({ outcome: 'COMPLETE', score: 900 }),
      formatPlayedAt(0),
      RANDOM,
      storage,
    );
    writeRun(
      createRun({ outcome: 'COMPLETE', score: 100 }),
      formatPlayedAt(1),
      RANDOM,
      storage,
    );

    expect(readSave(storage).completedWorlds[0].score).toBe(900);
  });

  it('should keep the best run in the world record when it has scrolled off the list', () => {
    const storage = createStorage(new Map());

    writeRun(
      createRun({ outcome: 'COMPLETE', score: 900 }),
      formatPlayedAt(0),
      RANDOM,
      storage,
    );
    times(RUNS_KEPT, (index) =>
      writeRun(
        createRun({ name: 'ZZZ' }),
        formatPlayedAt(index + 1),
        RANDOM,
        storage,
      ),
    );

    const { completedWorlds, runs } = readSave(storage);
    expect(runs, 'the run itself is gone').toHaveLength(RUNS_KEPT);
    expect(completedWorlds[0].replay, 'but the world kept its best').toEqual(
      createReplay('ABC'),
    );
  });

  it('should let go of the oldest run when the shelf is full', () => {
    const storage = createStorage(new Map());

    times(RUNS_KEPT + 5, (index) =>
      writeRun(createRun(), formatPlayedAt(index), RANDOM, storage),
    );

    const { runs } = readSave(storage);
    expect(runs).toHaveLength(RUNS_KEPT);
    expect(runs[0].playedAt, 'the first five dropped off').toBe(
      formatPlayedAt(5),
    );
  });

  it('should tell the runs apart when two of them ended in the same instant', () => {
    const storage = createStorage(new Map());

    writeRun(createRun(), formatPlayedAt(0), constant(0.1), storage);
    writeRun(createRun(), formatPlayedAt(0), constant(0.2), storage);

    expect(readSave(storage).runs, 'neither overwrites the other').toHaveLength(
      2,
    );
  });

  it('should not change the run it was given when it writes it', () => {
    const run = createRun();

    writeRun(run, formatPlayedAt(0), RANDOM, createStorage(new Map()));

    expect(run).toEqual(createRun());
  });
});
