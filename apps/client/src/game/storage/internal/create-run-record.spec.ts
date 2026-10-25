import { constant } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { FinishedRun } from '../types/finished-run';
import { createRunId } from './create-run-id';
import { createRunRecord } from './create-run-record';

const RUN: FinishedRun = {
  name: 'ABC',
  day: '2026-09-04',
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: { worldName: 'ABC', steps: 1, entries: [[0, 0]] },
};

describe('createRunRecord', () => {
  it('should file the run with its id and the moment it ended', () => {
    expect(createRunRecord(RUN, 'NOW', constant(0.5))).toEqual({
      ...RUN,
      id: createRunId('ABC', 'NOW', constant(0.5)),
      playedAt: 'NOW',
    });
  });

  it('should give the same id when the same random draw is used', () => {
    expect(createRunRecord(RUN, 'NOW', constant(0.3)).id).toBe(
      createRunRecord(RUN, 'NOW', constant(0.3)).id,
    );
  });

  it('should give another id when another random draw is used', () => {
    expect(createRunRecord(RUN, 'NOW', constant(0.3)).id).not.toBe(
      createRunRecord(RUN, 'NOW', constant(0.4)).id,
    );
  });

  it('should keep the run empty of a moment when it ended at no known moment', () => {
    expect(createRunRecord(RUN, '', constant(0.5)).playedAt).toBe('');
  });
});
