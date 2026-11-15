import { describe, expect, it } from 'vitest';

import { computeLevelScore } from './compute-level-score';
import { LEVEL_SCORE_BASE, LEVEL_SCORE_MIN } from './consts';

describe('computeLevelScore', () => {
  it('should give the full score when the level takes no time', () => {
    const score = computeLevelScore(0);

    expect(score).toBe(LEVEL_SCORE_BASE);
  });

  it('should take a hundred points for each second when the level takes a while', () => {
    const score = computeLevelScore(12);

    expect(score).toBe(8800);
  });

  it('should round up to the next second when the time ends on a half second', () => {
    const score = computeLevelScore(12.5);

    expect(score).toBe(8700);
  });

  it('should round down to the second when the time is just under a half second past it', () => {
    const score = computeLevelScore(12.4);

    expect(score).toBe(8800);
  });

  it('should give the smallest score when the time reaches it exactly', () => {
    const score = computeLevelScore(99);

    expect(score).toBe(LEVEL_SCORE_MIN);
  });

  it('should never go below the smallest score when the level takes very long', () => {
    const score = computeLevelScore(500);

    expect(score).toBe(LEVEL_SCORE_MIN);
  });
});
