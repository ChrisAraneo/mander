import { describe, expect, it } from 'vitest';

import { SHOOTER_RELOAD_SECONDS } from '../consts';
import { getEnemyReloadSeconds } from './get-enemy-reload-seconds';

describe('getEnemyReloadSeconds', () => {
  it('should give a full reload when the enemy shoots', () => {
    const reload = getEnemyReloadSeconds('SHOOTER');

    expect(reload).toBe(SHOOTER_RELOAD_SECONDS);
  });

  it('should give no reload when the enemy is hopping', () => {
    const reload = getEnemyReloadSeconds('HOPPING');

    expect(reload).toBe(0);
  });

  it('should give no reload when the enemy is horned', () => {
    const reload = getEnemyReloadSeconds('HORNED');

    expect(reload).toBe(0);
  });

  it('should give no reload when the enemy is fast', () => {
    const reload = getEnemyReloadSeconds('FAST');

    expect(reload).toBe(0);
  });

  it('should give no reload when the enemy flies', () => {
    const reload = getEnemyReloadSeconds('FLYING');

    expect(reload).toBe(0);
  });

  it('should give no reload when the enemy is a beartrap', () => {
    const reload = getEnemyReloadSeconds('BEARTRAP');

    expect(reload).toBe(0);
  });
});
