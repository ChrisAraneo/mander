import type { Point } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIREBALL_HITBOX_INSET, FIREBALL_SIZE } from '../consts';
import { computeFireballHitbox } from './compute-fireball-hitbox';

const createCentre = (): Point => ({ x: 100, y: 200 });

describe('computeFireballHitbox', () => {
  it('should give a square of half-width FIREBALL_SIZE / 2 - FIREBALL_HITBOX_INSET around the centre when it is given the centre of a fireball', () => {
    const centre = createCentre();

    const hitbox = computeFireballHitbox(centre);

    expect(FIREBALL_SIZE / 2 - FIREBALL_HITBOX_INSET).toBe(5);
    expect(hitbox).toEqual({ left: 95, right: 105, top: 195, bottom: 205 });
  });

  it('should leave the centre point unchanged when it is given the centre of a fireball', () => {
    const centre = createCentre();

    computeFireballHitbox(centre);

    expect(centre).toEqual(createCentre());
  });
});
