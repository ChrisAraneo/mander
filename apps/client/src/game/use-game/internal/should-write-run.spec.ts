import { describe, expect, it } from 'vitest';

import { MIN_ABANDONED_SECONDS } from '../consts';
import { shouldWriteRun } from './should-write-run';

describe('shouldWriteRun', () => {
  it('should write the run when it ended in death', () => {
    expect(shouldWriteRun(false, 'GAME_OVER', 30)).toBe(true);
  });

  it('should keep the run when the death came quickly', () => {
    expect(shouldWriteRun(false, 'GAME_OVER', 1)).toBe(true);
  });

  it('should write the run when it was finished', () => {
    expect(shouldWriteRun(false, 'COMPLETE', 30)).toBe(true);
  });

  it('should leave the run out of the archive when the player barely started it', () => {
    expect(shouldWriteRun(false, 'ABANDONED', MIN_ABANDONED_SECONDS - 1)).toBe(
      false,
    );
  });

  it('should keep the run when the player walked away from it mid-world', () => {
    expect(shouldWriteRun(false, 'ABANDONED', MIN_ABANDONED_SECONDS)).toBe(
      true,
    );
  });

  it('should write the run once when the game calls it over more than once', () => {
    expect(shouldWriteRun(true, 'GAME_OVER', 30)).toBe(false);
    expect(shouldWriteRun(true, 'ABANDONED', 30)).toBe(false);
  });
});
