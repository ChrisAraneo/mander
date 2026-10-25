import { describe, expect, it } from 'vitest';

import { createEmptySave } from './create-empty-save';

describe('createEmptySave', () => {
  it('should hold no score and no worlds or runs when it creates a save', () => {
    expect(createEmptySave()).toEqual({
      score: 0,
      completedWorlds: [],
      playedWorlds: [],
      runs: [],
    });
  });

  it('should give a fresh save each time when it is called again', () => {
    expect(createEmptySave()).not.toBe(createEmptySave());
  });
});
