import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { parseRuns } from './parse-runs';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 1]] };

const RUN = {
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: '2026-09-04T10:00:00Z',
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: REPLAY,
};

describe('parseRuns', () => {
  it('should read every field when the run was stored whole', () => {
    expect(parseRuns([RUN])).toEqual([RUN]);
  });

  it('should keep each outcome when it is one the game knows', () => {
    expect(
      map(
        parseRuns([
          { ...RUN, outcome: 'COMPLETE' },
          { ...RUN, outcome: 'GAME_OVER' },
          { ...RUN, outcome: 'ABANDONED' },
        ]),
        (run) => run.outcome,
      ),
    ).toEqual(['COMPLETE', 'GAME_OVER', 'ABANDONED']);
  });

  it('should take the run as left unfinished when its outcome is unknown', () => {
    expect(parseRuns([{ ...RUN, outcome: 'LOST' }])[0].outcome).toBe(
      'ABANDONED',
    );
  });

  it('should drop the archived run when its replay did not survive the trip', () => {
    expect(parseRuns([{ id: 'A', name: 'ABC' }, { id: 'B' }])).toEqual([]);
  });

  it('should drop the run when it has no id', () => {
    expect(parseRuns([{ ...RUN, id: 7 }])).toEqual([]);
  });

  it('should give no runs when the stored value is not a list', () => {
    expect(parseRuns({})).toEqual([]);
  });
});
