import type { PackedReplay } from '@mander/engine';
import { map, padStart, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GHOSTS_SHOWN } from './consts';
import { findGhostRuns } from './find-ghost-runs';
import type { RunRecord } from './types/run-record';
import type { SaveData } from './types/save-data';

const formatPlayedAt = (minute: number): string =>
  `2026-09-04T10:${padStart(String(minute), 2, '0')}:00Z`;

const createReplay = (name: string): PackedReplay => ({
  worldName: name,
  steps: 1,
  entries: [[0, 0]],
});

const createRun = (patch: Partial<RunRecord> = {}): RunRecord => ({
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: formatPlayedAt(0),
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: createReplay(patch.name ?? 'ABC'),
  ...patch,
});

const createSave = (patch: Partial<SaveData> = {}): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
  ...patch,
});

const toIds = (runs: RunRecord[]): string[] => map(runs, (run) => run.id);

describe('findGhostRuns', () => {
  it('should offer the other runs when they belong to the same world', () => {
    const save = createSave({
      runs: [
        createRun({ id: 'RUN-1', playedAt: formatPlayedAt(1) }),
        createRun({ id: 'RUN-2', playedAt: formatPlayedAt(2) }),
      ],
    });

    expect(toIds(findGhostRuns(save, 'ABC', 'RUN-1'))).toEqual(['RUN-2']);
  });

  it('should leave out the run when it is the one being watched', () => {
    const save = createSave({
      runs: [
        createRun({ id: 'RUN-1' }),
        createRun({ id: 'RUN-2', playedAt: formatPlayedAt(2) }),
      ],
    });

    expect(toIds(findGhostRuns(save, 'ABC', 'RUN-2'))).not.toContain('RUN-2');
  });

  it('should leave out a run when it belongs to another world', () => {
    const save = createSave({
      runs: [
        createRun({ id: 'MINE', name: 'ABC' }),
        createRun({ id: 'THEIRS', name: 'XYZ', playedAt: formatPlayedAt(2) }),
      ],
    });

    expect(toIds(findGhostRuns(save, 'ABC', ''))).toEqual(['MINE']);
  });

  it('should show the most recent runs and no more when more are kept than the screen holds', () => {
    const save = createSave({
      runs: times(GHOSTS_SHOWN + 3, (index) =>
        createRun({ id: `RUN-${index}`, playedAt: formatPlayedAt(index) }),
      ),
    });

    expect(toIds(findGhostRuns(save, 'ABC', ''))).toEqual(
      map(times(GHOSTS_SHOWN), (index) => `RUN-${GHOSTS_SHOWN + 2 - index}`),
    );
  });

  it('should race the kept best run when its own record has aged out', () => {
    const save = createSave({
      completedWorlds: [
        {
          name: 'ABC',
          day: '2026-09-04',
          score: 900,
          seconds: 30,
          runId: 'GONE',
          replay: createReplay('ABC'),
        },
      ],
      runs: [createRun({ id: 'RUN-1' })],
    });

    expect(toIds(findGhostRuns(save, 'ABC', ''))).toEqual([
      'RUN-1',
      'ABC:best',
    ]);
  });

  it('should find nothing to race when the world has never been played', () => {
    expect(findGhostRuns(createSave(), 'ZZZ', '')).toEqual([]);
  });

  it('should skip the run when its world cannot be rebuilt', () => {
    const save = createSave({ runs: [createRun({ id: 'RUN-1', day: '' })] });

    expect(findGhostRuns(save, 'ABC', '')).toEqual([]);
  });
});
