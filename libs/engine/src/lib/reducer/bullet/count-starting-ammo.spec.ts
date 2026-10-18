import {
  BULLET,
  FOUR_BULLETS,
  HEART,
  type Item,
  RED_GEM,
  STAR,
} from '@mander/model';
import { match, P } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { countStartingAmmo } from './count-starting-ammo';

const { select } = P;

const getItemAmount = (item: Item): number =>
  match(item.effect)
    .with({ amount: select() }, (amount) => amount)
    .otherwise(() => 0);

describe('countStartingAmmo', () => {
  it('should add up the bullets of every bullet item when the inventory holds them', () => {
    const inventory = [BULLET, FOUR_BULLETS, BULLET];

    const ammo = countStartingAmmo(inventory);

    expect(ammo).toBe(2 * getItemAmount(BULLET) + getItemAmount(FOUR_BULLETS));
  });

  it('should count only the bullet items when the inventory also holds other items', () => {
    const inventory = [STAR, BULLET, HEART, RED_GEM];

    const ammo = countStartingAmmo(inventory);

    expect(ammo).toBe(getItemAmount(BULLET));
  });

  it('should give no bullets when the inventory holds only other items', () => {
    const inventory = [STAR, HEART, RED_GEM];

    const ammo = countStartingAmmo(inventory);

    expect(ammo).toBe(0);
  });

  it('should give no bullets when the inventory is empty', () => {
    const ammo = countStartingAmmo([]);

    expect(ammo).toBe(0);
  });
});
