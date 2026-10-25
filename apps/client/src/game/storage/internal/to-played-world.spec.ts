import { describe, expect, it } from 'vitest';

import { toPlayedWorld } from './to-played-world';

const WORLD = {
  name: 'ABC',
  day: '2026-09-04',
  playedAt: '2026-09-04T10:00:00Z',
  runs: 3,
};

describe('toPlayedWorld', () => {
  it('should read every field when the world was stored whole', () => {
    expect(toPlayedWorld(WORLD)).toEqual(WORLD);
  });

  it('should count no runs when the run count is not a number', () => {
    expect(
      toPlayedWorld({ ...WORLD, runs: '3' as unknown as number }).runs,
    ).toBe(0);
  });

  it('should fill in empty fields when the world was stored with nothing', () => {
    expect(toPlayedWorld({})).toEqual({
      name: '',
      day: '',
      playedAt: '',
      runs: 0,
    });
  });
});
