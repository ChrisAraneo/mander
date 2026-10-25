import { describe, expect, it } from 'vitest';

import { parsePlayedWorlds } from './parse-played-worlds';

describe('parsePlayedWorlds', () => {
  it('should read every field when the world was stored whole', () => {
    const world = {
      name: 'ABC',
      day: '2026-09-04',
      playedAt: '2026-09-04T10:00:00Z',
      runs: 3,
    };

    expect(parsePlayedWorlds([world])).toEqual([world]);
  });

  it('should fill in the missing fields when a world was stored with only its name', () => {
    expect(parsePlayedWorlds([{ name: 'ABC' }])).toEqual([
      { name: 'ABC', day: '', playedAt: '', runs: 0 },
    ]);
  });

  it('should drop the world when it has no name', () => {
    expect(parsePlayedWorlds([{ runs: 3 }, null])).toEqual([]);
  });

  it('should give no worlds when the stored value is not a list', () => {
    expect(parsePlayedWorlds('ABC')).toEqual([]);
  });
});
