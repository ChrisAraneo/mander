import { describe, expect, it } from 'vitest';

import type { RunRecord } from '../types/run-record';
import { isPlayable } from './is-playable';

const RUN: RunRecord = {
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: 'NOW',
  outcome: 'GAME_OVER',
  score: 0,
  seconds: 0,
  levelIndex: 0,
  replay: { worldName: 'ABC', steps: 1, entries: [[0, 0]] },
};

describe('isPlayable', () => {
  it('should allow the run when it knows its day', () => {
    expect(isPlayable(RUN)).toBe(true);
  });

  it('should refuse the run when its day is empty', () => {
    expect(isPlayable({ ...RUN, day: '' })).toBe(false);
  });
});
