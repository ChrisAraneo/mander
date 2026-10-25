import { describe, expect, it } from 'vitest';

import { tryGetLocalStorage } from './try-get-local-storage';

describe('tryGetLocalStorage', () => {
  it('should give no storage when the page cannot reach it', () => {
    expect(tryGetLocalStorage()).toBeUndefined();
  });
});
