import { describe, expect, it } from 'vitest';

import { isSaveShape } from './is-save-shape';

describe('isSaveShape', () => {
  it('should accept the value when it is a record', () => {
    expect(isSaveShape({ score: 7 })).toBe(true);
  });

  it('should accept the value when it is an empty record', () => {
    expect(isSaveShape({})).toBe(true);
  });

  it('should refuse the value when it is text', () => {
    expect(isSaveShape('save')).toBe(false);
  });

  it('should refuse the value when it is empty', () => {
    expect(isSaveShape(null)).toBe(false);
  });
});
