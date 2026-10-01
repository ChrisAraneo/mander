import { createRandom } from '@mander/utils';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CHEST_ITEM_COUNT } from '../../consts';
import { getRarity } from './get-rarity';
import { rollChestRarities } from './roll-chest-rarities';

const rollFrom = (seed: string) =>
  rollChestRarities({ random: createRandom(seed) }).rarities;

describe('rollChestRarities', () => {
  it('should roll one rarity for each card when it fills a chest', () => {
    expect(size(rollFrom('DAY-1'))).toBe(CHEST_ITEM_COUNT);
  });

  it('should give each card the rarity of its roll when it rolls the rarities', () => {
    const random = createRandom('DAY-1');

    expect(rollFrom('DAY-1')).toEqual(
      times(CHEST_ITEM_COUNT, () => getRarity(random.rollFloat())),
    );
  });

  it('should roll the same rarities when the generator starts from the same seed', () => {
    expect(rollFrom('DAY-1')).toEqual(rollFrom('DAY-1'));
  });

  it('should roll other rarities when the seed is different', () => {
    expect(
      size(
        uniq(
          map(
            times(50, (day) => rollFrom(`DAY-${day}`)),
            String,
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pass the generator on when it rolls the rarities', () => {
    const random = createRandom('DAY-1');

    expect(rollChestRarities({ random }).random).toBe(random);
  });
});
