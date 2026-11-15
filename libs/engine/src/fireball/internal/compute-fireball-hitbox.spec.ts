import type { Point } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIREBALL_HITBOX_INSET, FIREBALL_SIZE } from '../consts';
import { computeFireballHitbox } from './compute-fireball-hitbox';

const CENTRE_LEFT = 100;

const CENTRE_TOP = 200;

const HITBOX_HALF_WIDTH = 5;

const createCentre = (): Point => ({ x: CENTRE_LEFT, y: CENTRE_TOP });

describe('computeFireballHitbox', () => {
  it('should draw a small square around the middle of the ball when it is given the centre of a fireball', () => {
    const centre = createCentre();

    const hitbox = computeFireballHitbox(centre);

    expect(FIREBALL_SIZE / 2 - FIREBALL_HITBOX_INSET).toBe(HITBOX_HALF_WIDTH);
    expect(hitbox).toEqual({
      left: CENTRE_LEFT - HITBOX_HALF_WIDTH,
      right: CENTRE_LEFT + HITBOX_HALF_WIDTH,
      top: CENTRE_TOP - HITBOX_HALF_WIDTH,
      bottom: CENTRE_TOP + HITBOX_HALF_WIDTH,
    });
  });

  it('should leave the centre point unchanged when it is given the centre of a fireball', () => {
    const centre = createCentre();

    computeFireballHitbox(centre);

    expect(centre).toEqual(createCentre());
  });
});
