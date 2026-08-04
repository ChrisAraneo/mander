import { DOUBLE_HEART, type Item } from '@mander/model';
import { countBy, filter, flatMap, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generateChestItems } from './generate-chest-items';

const SEED = 'PROBE-SEED';

const seeds = times(400, (day) => `DAY-${day}`);

const drawn = (): Item[] => flatMap(seeds, generateChestItems);

describe('generateChestItems', () => {
  it('fills the chest from the same seed the same way', () => {
    expect(generateChestItems(SEED)).toEqual(generateChestItems(SEED));
  });

  it('fills the chest from a different seed differently', () => {
    const filled = map(seeds, (seed) => map(generateChestItems(seed), 'id'));

    expect(size(uniq(map(filled, String)))).toBeGreaterThan(1);
  });

  it('always leaves something in the chest', () => {
    expect(
      filter(seeds, (seed) => size(generateChestItems(seed)) !== 1),
    ).toEqual([]);
  });

  it('reaches for every item in the pool sooner or later', () => {
    expect(size(countBy(drawn(), 'id'))).toBe(3);
  });

  it('parts with a rare item less readily than a common one', () => {
    const counts = countBy(drawn(), 'rarity');

    expect(counts['RARE']).toBeLessThan(counts['COMMON'] / 2);
  });

  it('keeps the rare item worth finding rather than shelving it', () => {
    const counts = countBy(drawn(), 'id');

    expect(counts[DOUBLE_HEART.id] / size(seeds)).toBeGreaterThan(0.1);
  });
});
