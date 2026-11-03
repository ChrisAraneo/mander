import { describe, expect, it } from 'vitest';

import { CANNON_RELOAD_SECONDS } from '../consts';
import { getCannonReloadSeconds } from './get-cannon-reload-seconds';

describe('getCannonReloadSeconds', () => {
  it('should give the usual reload when the cannon is regular', () => {
    expect(getCannonReloadSeconds('REGULAR')).toBe(CANNON_RELOAD_SECONDS);
  });

  it('should take one and a half times as long when the cannon is triple', () => {
    expect(getCannonReloadSeconds('TRIPLE')).toBe(CANNON_RELOAD_SECONDS * 1.5);
  });
});
