import {
  BLUE_GEM,
  BOOTS_OF_CLOUDS,
  BULLET,
  HEART,
  type Item,
  MOON_MAGNET,
  STAR,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { countStartingFireballs } from './count-starting-fireballs';

const PLAIN_TRINKET: Item = {
  id: 'TRINKET',
  name: 'Trinket',
  description: 'Does nothing',
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
};

describe('countStartingFireballs', () => {
  it('should count the fireballs the magnet gives when the player carries one', () => {
    const count = countStartingFireballs([MOON_MAGNET]);

    expect(count).toBe(2);
  });

  it('should add up every magnet when the player carries several among other items', () => {
    const count = countStartingFireballs([MOON_MAGNET, HEART, MOON_MAGNET]);

    expect(count).toBe(4);
  });

  it('should count nothing when the player carries only items of other kinds', () => {
    const count = countStartingFireballs([
      PLAIN_TRINKET,
      HEART,
      BLUE_GEM,
      STAR,
      BULLET,
      BOOTS_OF_CLOUDS,
    ]);

    expect(count).toBe(0);
  });

  it('should count nothing when the player carries nothing', () => {
    const count = countStartingFireballs([]);

    expect(count).toBe(0);
  });
});
