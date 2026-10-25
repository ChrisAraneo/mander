import { createRandom } from '@mander/engine';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CHEST_ITEM_COUNT } from '../../consts';
import { takeRandomChestRarities } from './take-random-chest-rarities';
import { toRarity } from './to-rarity';

const takeRandomFrom = (seed: string) =>
  takeRandomChestRarities({ random: createRandom(seed) }).rarities;

describe('takeRandomChestRarities', () => {
  it('should pick one rarity for each card when it fills a chest', () => {
    expect(size(takeRandomFrom('DAY-1'))).toBe(CHEST_ITEM_COUNT);
  });

  it('should give each card the rarity of its roll when it picks the rarities', () => {
    const random = createRandom('DAY-1');

    expect(takeRandomFrom('DAY-1')).toEqual(
      times(CHEST_ITEM_COUNT, () => toRarity(random())),
    );
  });

  it('should pick the same rarities when the generator starts from the same seed', () => {
    expect(takeRandomFrom('DAY-1')).toEqual(takeRandomFrom('DAY-1'));
  });

  it('should pick other rarities when the seed is different', () => {
    expect(
      size(
        uniq(
          map(
            times(50, (day) => takeRandomFrom(`DAY-${day}`)),
            String,
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pass the generator on when it picks the rarities', () => {
    const random = createRandom('DAY-1');

    expect(takeRandomChestRarities({ random }).random).toBe(random);
  });
});
