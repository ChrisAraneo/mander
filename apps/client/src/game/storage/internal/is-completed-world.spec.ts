import { describe, expect, it } from 'vitest';

import { isCompletedWorld } from './is-completed-world';

describe('isCompletedWorld', () => {
  it('should accept the value when it is a record with a name', () => {
    expect(isCompletedWorld({ name: 'ABC' })).toBe(true);
  });

  it('should refuse the value when its name is not text', () => {
    expect(isCompletedWorld({ name: 7 })).toBe(false);
  });

  it('should refuse the value when it is not a record', () => {
    expect(isCompletedWorld('ABC')).toBe(false);
  });

  it('should refuse the value when it is empty', () => {
    expect(isCompletedWorld(null)).toBe(false);
  });
});
