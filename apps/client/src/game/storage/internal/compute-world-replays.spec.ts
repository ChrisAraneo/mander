import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { computeWorldReplays } from './compute-world-replays';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 0]] };

const createRun = (patch: Partial<RunRecord> = {}): RunRecord => ({
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: '2026-09-04T10:00:00Z',
  outcome: 'GAME_OVER',
  score: 0,
  seconds: 0,
  levelIndex: 0,
  replay: REPLAY,
  ...patch,
});

const createSave = (runs: RunRecord[]): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs,
});

const COMPLETED: CompletedWorld = {
  name: 'ABC',
  day: '2026-09-04',
  score: 900,
  seconds: 61,
  runId: 'GONE',
  replay: REPLAY,
};

const toRunIds = (runs: RunRecord[]): string[] => map(runs, (run) => run.id);

describe('computeWorldReplays', () => {
  it('should list the runs of the world newest first when it gathers the replays', () => {
    const save = createSave([
      createRun({ id: 'OLD', playedAt: '2026-09-04T09:00:00Z' }),
      createRun({ id: 'NEW', playedAt: '2026-09-04T11:00:00Z' }),
      createRun({ id: 'OTHER', name: 'XYZ' }),
    ]);

    expect(toRunIds(computeWorldReplays(save, 'ABC', null))).toEqual([
      'NEW',
      'OLD',
    ]);
  });

  it('should add the best run at the end when its run is no longer kept', () => {
    expect(
      toRunIds(
        computeWorldReplays(createSave([createRun()]), 'ABC', COMPLETED),
      ),
    ).toEqual(['RUN-1', 'ABC:best']);
  });

  it('should leave out the runs when their day is unknown', () => {
    expect(
      computeWorldReplays(createSave([createRun({ day: '' })]), 'ABC', null),
    ).toEqual([]);
  });

  it('should give no replays when the world has no runs', () => {
    expect(computeWorldReplays(createSave([]), 'ABC', null)).toEqual([]);
  });
});
