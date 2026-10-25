import { map, max, min, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { INVINCIBLE_MIN_ALPHA, INVINCIBLE_PULSES_PER_SECOND } from '../consts';
import { computeInvincibleAlpha } from './compute-invincible-alpha';

const PULSE_SECONDS = 1 / INVINCIBLE_PULSES_PER_SECOND;

const ALPHAS = map(range(0, 3, 0.01), computeInvincibleAlpha);

describe('computeInvincibleAlpha', () => {
  it('should draw the player fully solid when a pulse begins', () => {
    expect(computeInvincibleAlpha(0)).toBeCloseTo(1);
  });

  it('should draw the player at its faintest when it is halfway through a pulse', () => {
    expect(computeInvincibleAlpha(PULSE_SECONDS / 2)).toBeCloseTo(
      INVINCIBLE_MIN_ALPHA,
    );
  });

  it('should be fully solid again when a whole pulse has passed', () => {
    expect(computeInvincibleAlpha(PULSE_SECONDS)).toBeCloseTo(1);
  });

  it('should never fade below the faintest when time goes on', () => {
    expect(min(ALPHAS)).toBeCloseTo(INVINCIBLE_MIN_ALPHA, 2);
  });

  it('should never go past fully solid when time goes on', () => {
    expect(max(ALPHAS)).toBeCloseTo(1, 2);
  });
});
