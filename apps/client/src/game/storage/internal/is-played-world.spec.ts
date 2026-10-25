import { describe, expect, it } from 'vitest';

import { isPlayedWorld } from './is-played-world';

describe('isPlayedWorld', () => {
  it('should accept the value when it is a record with a name', () => {
    expect(isPlayedWorld({ name: 'ABC' })).toBe(true);
  });

  it('should refuse the value when its name is not text', () => {
    expect(isPlayedWorld({ name: 7 })).toBe(false);
  });

  it('should refuse the value when it is not a record', () => {
    expect(isPlayedWorld('ABC')).toBe(false);
  });

  it('should refuse the value when it is empty', () => {
    expect(isPlayedWorld(undefined)).toBe(false);
  });
});
