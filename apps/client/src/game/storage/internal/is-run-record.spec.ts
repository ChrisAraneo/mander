import { describe, expect, it } from 'vitest';

import { isRunRecord } from './is-run-record';

describe('isRunRecord', () => {
  it('should accept the value when it is a record with an id', () => {
    expect(isRunRecord({ id: 'RUN-1' })).toBe(true);
  });

  it('should refuse the value when its id is not text', () => {
    expect(isRunRecord({ id: 7 })).toBe(false);
  });

  it('should refuse the value when it has a name but no id', () => {
    expect(isRunRecord({ name: 'ABC' })).toBe(false);
  });

  it('should refuse the value when it is empty', () => {
    expect(isRunRecord(null)).toBe(false);
  });
});
