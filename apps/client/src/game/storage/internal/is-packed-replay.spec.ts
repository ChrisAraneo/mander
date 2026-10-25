import { describe, expect, it } from 'vitest';

import { isPackedReplay } from './is-packed-replay';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 1]] };

describe('isPackedReplay', () => {
  it('should accept the replay when it was stored whole', () => {
    expect(isPackedReplay(REPLAY)).toBe(true);
  });

  it('should accept the replay when it holds no entries', () => {
    expect(isPackedReplay({ ...REPLAY, entries: [] })).toBe(true);
  });

  it('should refuse the replay when it has no world name', () => {
    expect(isPackedReplay({ ...REPLAY, worldName: 7 })).toBe(false);
  });

  it('should refuse the replay when its step count is not a number', () => {
    expect(isPackedReplay({ ...REPLAY, steps: '1' })).toBe(false);
  });

  it('should refuse the replay when its entries are not a list', () => {
    expect(isPackedReplay({ ...REPLAY, entries: {} })).toBe(false);
  });

  it('should refuse the replay when an entry is broken', () => {
    expect(isPackedReplay({ ...REPLAY, entries: [[0, 'X']] })).toBe(false);
  });

  it('should refuse the value when it is empty', () => {
    expect(isPackedReplay(null)).toBe(false);
  });
});
