import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import { findBestCompletedWorld } from './find-best-completed-world';

const createWorld = (score: number): CompletedWorld => ({
  name: 'ABC',
  day: '2026-09-04',
  score,
  seconds: 61,
  runId: `RUN-${score}`,
  replay: null,
});

describe('findBestCompletedWorld', () => {
  it('should keep the new run when it beats the earlier one', () => {
    const run = createWorld(900);

    expect(findBestCompletedWorld(run, createWorld(100))).toBe(run);
  });

  it('should keep the earlier run when the new one scores less', () => {
    const earlier = createWorld(900);

    expect(findBestCompletedWorld(createWorld(100), earlier)).toBe(earlier);
  });

  it('should keep the earlier run when both score the same', () => {
    const earlier = createWorld(900);

    expect(findBestCompletedWorld(createWorld(900), earlier)).toBe(earlier);
  });

  it('should keep the new run when there is no earlier one', () => {
    const run = createWorld(900);

    expect(findBestCompletedWorld(run, undefined)).toBe(run);
  });
});
