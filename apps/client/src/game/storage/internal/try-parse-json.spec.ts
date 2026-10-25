import { describe, expect, it } from 'vitest';

import { tryParseJson } from './try-parse-json';

describe('tryParseJson', () => {
  it('should read the value when the text is valid JSON', () => {
    expect(tryParseJson('{"score":7}')).toEqual({ score: 7 });
  });

  it('should give nothing when the text is broken', () => {
    expect(tryParseJson('{score')).toBeUndefined();
  });

  it('should give nothing when the text is empty', () => {
    expect(tryParseJson('')).toBeUndefined();
  });
});
