import { describe, expect, it } from 'vitest';

import type { RunOutcome } from '../types/run-outcome';
import type { RunRecord } from '../types/run-record';
import { toRunRecord } from './to-run-record';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 1]] };

const RUN: RunRecord = {
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

describe('toRunRecord', () => {
  it('should read every field when the run was stored whole', () => {
    expect(toRunRecord(RUN)).toEqual(RUN);
  });

  it('should take the run as left unfinished when its outcome is unknown', () => {
    expect(
      toRunRecord({ ...RUN, outcome: 'LOST' as unknown as RunOutcome })
        ?.outcome,
    ).toBe('ABANDONED');
  });

  it('should fill in empty fields when the run was stored with only its replay', () => {
    expect(toRunRecord({ replay: REPLAY })).toEqual({
      id: '',
      name: '',
      day: '',
      playedAt: '',
      outcome: 'ABANDONED',
      score: 0,
      seconds: 0,
      levelIndex: 0,
      replay: REPLAY,
    });
  });

  it('should give nothing when the replay did not survive the trip', () => {
    expect(toRunRecord({ id: 'RUN-1' })).toBeNull();
  });
});
