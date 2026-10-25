import { describe, expect, it } from 'vitest';

import { parseJson } from './parse-json.ts';

describe('parseJson', () => {
  it('should give the value the body holds when the body is json', () => {
    expect(parseJson('{"name":"NORMAL_001"}')).toEqual({ name: 'NORMAL_001' });
  });

  it('should give an empty list when the body is an empty json list', () => {
    expect(parseJson('[]')).toEqual([]);
  });

  it('should fail when the body is not json', () => {
    expect(() => parseJson('not json')).toThrow(SyntaxError);
  });
});
