import { describe, expect, it } from 'vitest';

import { parsePackedReplay } from './parse-packed-replay';

const REPLAY = {
  worldName: 'ABC',
  steps: 8,
  entries: [
    [0, 1],
    [4, 2],
  ],
};

describe('parsePackedReplay', () => {
  it('should keep the replay when it has a world, a length and its entries', () => {
    expect(parsePackedReplay(REPLAY)).toBe(REPLAY);
  });

  it('should drop the replay when it names no world', () => {
    expect(parsePackedReplay({ ...REPLAY, worldName: 3 })).toBeNull();
  });

  it('should drop the replay when its length is not a number', () => {
    expect(parsePackedReplay({ ...REPLAY, steps: '8' })).toBeNull();
  });

  it('should drop the replay when an entry holds something other than numbers', () => {
    expect(
      parsePackedReplay({
        ...REPLAY,
        entries: [
          [0, 1],
          ['4', 2],
        ],
      }),
    ).toBeNull();
  });

  it('should drop the replay when it has no entries', () => {
    expect(parsePackedReplay({ worldName: 'ABC', steps: 8 })).toBeNull();
  });

  it('should drop the replay when it is missing', () => {
    expect(parsePackedReplay(null)).toBeNull();
  });
});
