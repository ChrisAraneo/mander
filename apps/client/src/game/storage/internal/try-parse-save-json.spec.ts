import { describe, expect, it } from 'vitest';

import { tryParseSaveJson } from './try-parse-save-json';

describe('tryParseSaveJson', () => {
  it('should read the save when the stored text is valid JSON', () => {
    expect(tryParseSaveJson('{"score":7}')).toEqual({ score: 7 });
  });

  it('should give nothing when the stored text is broken', () => {
    expect(tryParseSaveJson('{score')).toBeUndefined();
  });

  it('should give nothing when nothing was stored', () => {
    expect(tryParseSaveJson(null)).toBeUndefined();
  });
});
