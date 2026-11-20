import { createRandom } from '@mander/common';
import type { ItemRarity } from '@mander/model';
import { map, size, times, toString, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findChestType } from './find-chest-type';
import { takeRandomEverydayItems } from './take-random-everyday-items';

const TWO_RARITIES: ItemRarity[] = ['COMMON', 'RARE'];

const THREE_COMMON: ItemRarity[] = ['COMMON', 'COMMON', 'COMMON'];

const SEEDS_TRIED = 30;

const takeRandomFrom = (rarities: ItemRarity[], seed: string) =>
  takeRandomEverydayItems({ rarities, random: createRandom(seed) });

describe('takeRandomEverydayItems', () => {
  it('should pick one card for each rarity when it fills a chest', () => {
    expect(
      map(
        takeRandomFrom(['COMMON', 'RARE', 'COMMON'], 'DAY-1'),
        (item) => item.rarity,
      ),
    ).toEqual(['COMMON', 'RARE', 'COMMON']);
  });

  it('should pick a type of its own for each card when it fills a chest', () => {
    const cards = takeRandomFrom(THREE_COMMON, 'DAY-1');

    expect(size(uniq(map(cards, findChestType)))).toBe(size(THREE_COMMON));
  });

  it('should fill the chest the same way when the generator starts from the same seed', () => {
    expect(takeRandomFrom(TWO_RARITIES, 'DAY-1')).toEqual(
      takeRandomFrom(TWO_RARITIES, 'DAY-1'),
    );
  });

  it('should fill the chest another way when the generator starts from another seed', () => {
    expect(
      size(
        uniq(
          times(SEEDS_TRIED, (index) =>
            toString(
              map(
                takeRandomFrom(TWO_RARITIES, `DAY-${index}`),
                (item) => item.id,
              ),
            ),
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pick nothing when there are no rarities', () => {
    expect(takeRandomFrom([], 'DAY-1')).toEqual([]);
  });
});
