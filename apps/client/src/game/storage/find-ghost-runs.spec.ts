import type { PackedReplay } from '@mander/engine';
import { map, padStart, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GHOSTS_SHOWN } from './consts';
import { findGhostRuns } from './find-ghost-runs';
import type { RunRecord, SaveData } from './save-data';

const at = (minute: number): string =>
  `2026-09-04T10:${padStart(String(minute), 2, '0')}:00Z`;

const replayOf = (name: string): PackedReplay => ({
  worldName: name,
  steps: 1,
  entries: [[0, 0]],
});

const run = (patch: Partial<RunRecord> = {}): RunRecord => ({
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: at(0),
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: replayOf(patch.name ?? 'ABC'),
  ...patch,
});

const save = (patch: Partial<SaveData> = {}): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
  ...patch,
});

const idsOf = (runs: RunRecord[]): string[] => map(runs, 'id');

describe('the runs that race alongside a replay as ghosts', () => {
  it('should offer the other runs when they belong to the same world', () => {
    const data = save({
      runs: [
        run({ id: 'RUN-1', playedAt: at(1) }),
        run({ id: 'RUN-2', playedAt: at(2) }),
      ],
    });

    expect(idsOf(findGhostRuns(data, 'ABC', 'RUN-1'))).toEqual(['RUN-2']);
  });

  it('should leave out the run when it is the one being watched', () => {
    const data = save({
      runs: [run({ id: 'RUN-1' }), run({ id: 'RUN-2', playedAt: at(2) })],
    });

    expect(idsOf(findGhostRuns(data, 'ABC', 'RUN-2'))).not.toContain('RUN-2');
  });

  it('should leave out a run when it belongs to another world', () => {
    const data = save({
      runs: [
        run({ id: 'MINE', name: 'ABC' }),
        run({ id: 'THEIRS', name: 'XYZ', playedAt: at(2) }),
      ],
    });

    expect(idsOf(findGhostRuns(data, 'ABC', ''))).toEqual(['MINE']);
  });

  it('should show the most recent runs and no more when more are kept than the screen holds', () => {
    const data = save({
      runs: times(GHOSTS_SHOWN + 3, (index) =>
        run({ id: `RUN-${index}`, playedAt: at(index) }),
      ),
    });

    expect(idsOf(findGhostRuns(data, 'ABC', ''))).toEqual(
      map(times(GHOSTS_SHOWN), (index) => `RUN-${GHOSTS_SHOWN + 2 - index}`),
    );
  });

  it('should race the kept best run when its own record has aged out', () => {
    const data = save({
      completedWorlds: [
        {
          name: 'ABC',
          day: '2026-09-04',
          score: 900,
          seconds: 30,
          runId: 'GONE',
          replay: replayOf('ABC'),
        },
      ],
      runs: [run({ id: 'RUN-1' })],
    });

    expect(idsOf(findGhostRuns(data, 'ABC', ''))).toEqual([
      'RUN-1',
      'ABC:best',
    ]);
  });

  it('should find nothing to race when the world has never been played', () => {
    expect(findGhostRuns(save(), 'ZZZ', '')).toEqual([]);
  });

  it('should skip the run when its world cannot be rebuilt', () => {
    const data = save({ runs: [run({ id: 'RUN-1', day: '' })] });

    expect(findGhostRuns(data, 'ABC', '')).toEqual([]);
  });
});
