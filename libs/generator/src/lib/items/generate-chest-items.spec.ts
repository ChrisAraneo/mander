import type { Item } from '@mander/model';
import {
  countBy,
  filter,
  flatMap,
  map,
  size,
  some,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  CHEST_ITEM_COUNT,
  CHEST_ITEM_POOL,
  generateChestItems,
} from './generate-chest-items';

const SEED = 'PROBE-SEED';

const seeds = times(400, (day) => `DAY-${day}`);

const drawn = (): Item[] => flatMap(seeds, generateChestItems);

const idsIn = (seed: string): string[] => map(generateChestItems(seed), 'id');

const leadCards = (): Item[] =>
  map(seeds, (seed) => generateChestItems(seed)[0]);

describe('generateChestItems', () => {
  it('fills the chest from the same seed the same way', () => {
    expect(generateChestItems(SEED)).toEqual(generateChestItems(SEED));
  });

  it('lays the cards out differently from a different seed', () => {
    const filled = map(seeds, idsIn);

    expect(size(uniq(map(filled, String)))).toBeGreaterThan(1);
  });

  it('always offers three cards to choose between', () => {
    expect(CHEST_ITEM_COUNT).toBe(3);
    expect(
      filter(seeds, (seed) => size(generateChestItems(seed)) !== 3),
    ).toEqual([]);
  });

  it('never offers the same item twice in one chest', () => {
    expect(
      filter(seeds, (seed) => size(uniq(idsIn(seed))) !== size(idsIn(seed))),
    ).toEqual([]);
  });

  it('reaches for every item in the pool sooner or later', () => {
    expect(size(countBy(drawn(), 'id'))).toBe(size(CHEST_ITEM_POOL));
  });

  it('lets a rare card lead the chest less often than a common one', () => {
    const leading = countBy(leadCards(), 'rarity');

    expect(leading['RARE']).toBeLessThan(leading['COMMON']);
  });

  it('keeps the rare cards worth finding rather than shelving them', () => {
    const withRare = filter(seeds, (seed) =>
      some(generateChestItems(seed), { rarity: 'RARE' }),
    );

    expect(size(withRare) / size(seeds)).toBeGreaterThan(0.1);
  });
});
