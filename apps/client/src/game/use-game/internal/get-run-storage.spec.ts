import { describe, expect, it } from 'vitest';

import { getRunStorage } from './get-run-storage';

const STORAGE = {} as unknown as Storage;

describe('getRunStorage', () => {
  it('should keep the save when no structure is chosen', () => {
    expect(getRunStorage(null, STORAGE)).toBe(STORAGE);
  });

  it('should give no save when a single structure is played', () => {
    expect(getRunStorage('NORMAL_001', STORAGE)).toBeUndefined();
  });

  it('should give no save when the browser has none and no structure is chosen', () => {
    expect(getRunStorage(null, undefined)).toBeUndefined();
  });
});
