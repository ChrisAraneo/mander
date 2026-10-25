import { describe, expect, it } from 'vitest';

import { addTrailingComma } from './add-trailing-comma.ts';

describe('addTrailingComma', () => {
  it('should end the list with a comma when its last name has none', () => {
    expect(addTrailingComma(' DR, __ ')).toBe(' DR, __,');
  });

  it('should only drop the space at the end when the list already ends with a comma', () => {
    expect(addTrailingComma('\n  DR,\n  __,\n')).toBe('\n  DR,\n  __,');
  });

  it('should give an empty list when the list is empty', () => {
    expect(addTrailingComma('  ')).toBe('');
  });
});
