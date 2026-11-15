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

import { computeStartingAmmo } from './compute-starting-ammo';
import { BASE_AMMO } from './consts';

const { select } = P;

const createNoEffectItem = (): Item => ({
  id: 'TEST_ITEM',
  name: 'Test item',
  description: 'Stands in for a real chest item',
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const createInventory = (): Item[] => [STAR, BULLET, HEART, RED_GEM];

const getItemAmount = (item: Item): number =>
  match(item.effect)
    .with({ amount: select() }, (amount) => amount)
    .otherwise(() => 0);

describe('computeStartingAmmo', () => {
  it('should add the bullets of every bullet item to the base ammo when the inventory holds them', () => {
    const inventory = [BULLET, FOUR_BULLETS, BULLET];

    const ammo = computeStartingAmmo(inventory);

    expect(ammo).toBe(
      BASE_AMMO + 2 * getItemAmount(BULLET) + getItemAmount(FOUR_BULLETS),
    );
  });

  it('should count only the bullet items when the inventory also holds other items', () => {
    const inventory = [STAR, BULLET, HEART, RED_GEM];

    const ammo = computeStartingAmmo(inventory);

    expect(ammo).toBe(BASE_AMMO + getItemAmount(BULLET));
  });

  it('should give the base ammo when the inventory holds only other items', () => {
    const inventory = [STAR, HEART, RED_GEM];

    const ammo = computeStartingAmmo(inventory);

    expect(ammo).toBe(BASE_AMMO);
  });

  it('should give the base ammo when the only item carries no effect', () => {
    const ammo = computeStartingAmmo([createNoEffectItem()]);

    expect(ammo).toBe(BASE_AMMO);
  });

  it('should not change the inventory it was given when it adds the ammo up', () => {
    const inventory = createInventory();

    computeStartingAmmo(inventory);

    expect(inventory).toEqual(createInventory());
  });

  it('should give the base ammo when the inventory is empty', () => {
    const ammo = computeStartingAmmo([]);

    expect(ammo).toBe(BASE_AMMO);
  });

  it('should give five bullets when the inventory is empty', () => {
    const ammo = computeStartingAmmo([]);

    expect(ammo).toBe(5);
  });

  it('should leave the inventory it was handed untouched when it adds the bullets up', () => {
    const inventory = createInventory();

    computeStartingAmmo(inventory);

    expect(inventory).toEqual(createInventory());
  });
});
