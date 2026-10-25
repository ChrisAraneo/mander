import { describe, expect, it } from 'vitest';

import { DEBUG_PARAM } from './consts';
import { isDebug } from './is-debug';

describe('isDebug', () => {
  it('should be on when the address asks for debugging', () => {
    expect(isDebug(`?${DEBUG_PARAM}`)).toBe(true);
  });

  it('should be on when debugging is asked for beside other settings', () => {
    expect(isDebug(`?seed=1&${DEBUG_PARAM}=1`)).toBe(true);
  });

  it('should be off when the address does not ask for debugging', () => {
    expect(isDebug('?seed=1')).toBe(false);
  });

  it('should be off when the address asks for the old debug setting', () => {
    expect(isDebug('?debug')).toBe(false);
  });

  it('should be off when the address has no settings', () => {
    expect(isDebug('')).toBe(false);
  });
});
