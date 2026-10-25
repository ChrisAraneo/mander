import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import { toPlayed } from './to-played';

const WORLD: CompletedWorld = {
  name: 'ABC',
  day: '2026-09-04',
  score: 900,
  seconds: 61,
  runId: 'RUN-1',
  replay: null,
};

describe('toPlayed', () => {
  it('should list the finished world as played once when it turns it into a played world', () => {
    expect(toPlayed(WORLD)).toEqual({
      name: 'ABC',
      day: '2026-09-04',
      playedAt: '',
      runs: 1,
    });
  });

  it('should give no play moment when the world has no day either', () => {
    expect(toPlayed({ ...WORLD, day: '' }).playedAt).toBe('');
  });
});
