import { createRandom } from '@mander/common';
import {
  BULLET,
  FOUR_BULLETS,
  type Item,
  THREE_BULLETS,
  TWO_BULLETS,
} from '@mander/model';
import {
  countBy,
  filter,
  flatMap,
  map,
  mapValues,
  size,
  some,
  sortBy,
  sum,
  times,
  uniq,
  values,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  CHEST_ITEM_COUNT,
  CHEST_ITEM_POOL,
  CHEST_ITEM_TYPES,
  RARITY_CHANCE,
} from '../consts';
import type { ChestItemType } from '../types/chest-item-type';
import { findChestType } from './internal/find-chest-type';
import { takeRandomChestItems } from './take-random-chest-items';

const SEED = 'PROBE-SEED';

const SEEDS_TRIED = 400;

const LEAST_RARE_SHARE = 0.1;

const SEEDS = times(SEEDS_TRIED, (day) => `DAY-${day}`);

const takeRandomFrom = (seed: string): Item[] =>
  takeRandomChestItems(createRandom(seed));

const takeRandomItems = (): Item[] => flatMap(SEEDS, takeRandomFrom);

const takeRandomItemIds = (seed: string): string[] =>
  map(takeRandomFrom(seed), 'id');

const takeRandomItemTypes = (seed: string): (ChestItemType | undefined)[] =>
  map(takeRandomFrom(seed), findChestType);

const takeRandomLeadItems = (): Item[] =>
  map(SEEDS, (seed) => takeRandomFrom(seed)[0]);

describe('takeRandomChestItems', () => {
  it('should fill the chest the same way when the generator starts from the same seed', () => {
    expect(takeRandomFrom(SEED)).toEqual(takeRandomFrom(SEED));
  });

  it('should lay the cards out differently when the generator starts from other seeds', () => {
    const filled = map(SEEDS, takeRandomItemIds);

    expect(size(uniq(map(filled, String)))).toBeGreaterThan(1);
  });

  it('should offer three cards to choose between when it fills a chest', () => {
    expect(CHEST_ITEM_COUNT).toBe(3);
    expect(filter(SEEDS, (seed) => size(takeRandomFrom(seed)) !== 3)).toEqual(
      [],
    );
  });

  it('should pick a type of its own for each card when it fills a chest', () => {
    expect(CHEST_ITEM_TYPES).toEqual(['GEM', 'BULLET', 'HEART', 'STAR']);
    expect(
      filter(
        SEEDS,
        (seed) => size(uniq(takeRandomItemTypes(seed))) !== CHEST_ITEM_COUNT,
      ),
      'no chest doubles up on a type',
    ).toEqual([]);
  });

  it('should reach for every type when enough chests are filled', () => {
    expect(sortBy(uniq(map(takeRandomItems(), findChestType)))).toEqual(
      sortBy(CHEST_ITEM_TYPES),
    );
  });

  it('should never offer the same item twice when it fills one chest', () => {
    expect(
      filter(
        SEEDS,
        (seed) =>
          size(uniq(takeRandomItemIds(seed))) !== size(takeRandomItemIds(seed)),
      ),
    ).toEqual([]);
  });

  it('should reach for every item in the pool when enough chests are filled', () => {
    expect(size(countBy(takeRandomItems(), 'id'))).toBe(size(CHEST_ITEM_POOL));
  });

  it('should lead the chest less often than a common one when the card is rare', () => {
    const leading = countBy(takeRandomLeadItems(), 'rarity');

    expect(leading['RARE']).toBeLessThan(leading['COMMON']);
  });

  it('should promise seventy-nine commons and twenty-one rares in a hundred when it rolls the rarities', () => {
    expect(RARITY_CHANCE).toEqual({ COMMON: 0.79, RARE: 0.21 });
    expect(sum(values(RARITY_CHANCE)), 'and nothing else').toBeCloseTo(1);
  });

  it('should pick the cards close to those odds when enough chests are filled', () => {
    const cards = takeRandomItems();

    const share = mapValues(
      countBy(cards, 'rarity'),
      (count) => count / size(cards),
    );

    expect(share['COMMON']).toBeCloseTo(RARITY_CHANCE.COMMON, 1);
    expect(share['RARE']).toBeCloseTo(RARITY_CHANCE.RARE, 1);
  });

  it('should keep the bullet cards in when it stocks the deck', () => {
    expect(map(CHEST_ITEM_POOL, 'id')).toEqual(
      expect.arrayContaining([
        BULLET.id,
        TWO_BULLETS.id,
        THREE_BULLETS.id,
        FOUR_BULLETS.id,
      ]),
    );
  });

  it('should offer a rare card often enough to be worth finding when enough chests are filled', () => {
    const withRare = filter(SEEDS, (seed) =>
      some(takeRandomFrom(seed), { rarity: 'RARE' }),
    );

    expect(size(withRare) / size(SEEDS)).toBeGreaterThan(LEAST_RARE_SHARE);
  });
});
