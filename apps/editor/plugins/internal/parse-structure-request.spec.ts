import { describe, expect, it } from 'vitest';

import { parseStructureRequest } from './parse-structure-request.ts';

describe('parseStructureRequest', () => {
  it('should give the request with its pool and unix line endings when the name and text are sound', () => {
    expect(
      parseStructureRequest({ name: 'HARD_001', text: '[\r\n  [],\r\n]' }),
    ).toEqual({ name: 'HARD_001', pool: 'hard', text: '[\n  [],\n]' });
  });

  it('should give no request when the name has no known pool', () => {
    expect(
      parseStructureRequest({ name: 'EASY_001', text: '[]' }),
    ).toBeUndefined();
  });

  it('should give no request when the name has too few digits', () => {
    expect(
      parseStructureRequest({ name: 'NORMAL_5', text: '[]' }),
    ).toBeUndefined();
  });

  it('should give no request when the body is not an object with a name and a text', () => {
    expect(parseStructureRequest({ name: 1, text: '[]' })).toBeUndefined();
    expect(parseStructureRequest({ name: 'NORMAL_001' })).toBeUndefined();
    expect(parseStructureRequest(null)).toBeUndefined();
    expect(parseStructureRequest('NORMAL_001')).toBeUndefined();
  });
});
