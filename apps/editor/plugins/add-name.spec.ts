import { describe, expect, it } from 'vitest';

import { addName } from './add-name.ts';

describe('addName', () => {
  it('should add the name on a line of its own when the list spans several lines', () => {
    expect(addName('\n  DR,\n  __,\n', 'CN')).toBe('\n  DR,\n  __,\n  CN,\n');
  });

  it('should close the last name with a comma when the list spans several lines without one', () => {
    expect(addName('\n  DR,\n  __\n', 'CN')).toBe('\n  DR,\n  __,\n  CN,\n');
  });

  it('should add the name after a comma when the list sits on one line', () => {
    expect(addName(' DR, __ ', 'CN')).toBe(' DR, __, CN ');
  });

  it('should add the name alone when the list is empty', () => {
    expect(addName('', 'CN')).toBe(' CN ');
  });
});
