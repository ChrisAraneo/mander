import { describe, expect, it } from 'vitest';

import { createStructureRequest } from './create-structure-request.ts';

describe('createStructureRequest', () => {
  it('should give the request with its pool and plain line endings when the name is a structure name', () => {
    expect(
      createStructureRequest('HARD_012', '[\r\n  [],\r\n  [],\r\n]'),
    ).toEqual({ name: 'HARD_012', pool: 'hard', text: '[\n  [],\n  [],\n]' });
  });

  it('should give nothing when the name belongs to no pool', () => {
    expect(createStructureRequest('OTHER_001', '[]')).toBeUndefined();
  });

  it('should give nothing when the name has too few digits', () => {
    expect(createStructureRequest('NORMAL_01', '[]')).toBeUndefined();
  });

  it('should give nothing when the name is empty', () => {
    expect(createStructureRequest('', '')).toBeUndefined();
  });
});
