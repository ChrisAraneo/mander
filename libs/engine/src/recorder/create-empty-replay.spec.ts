import { describe, expect, it } from 'vitest';

import { createEmptyReplay } from './create-empty-replay';

describe('createEmptyReplay', () => {
  it('should name the world and hold no steps and no inputs when a recording begins', () => {
    const replay = createEmptyReplay('WORLD');

    expect(replay).toEqual({ worldName: 'WORLD', steps: 0, entries: [] });
  });

  it('should keep the world name as it is when the name is empty', () => {
    const replay = createEmptyReplay('');

    expect(replay.worldName).toBe('');
  });
});
