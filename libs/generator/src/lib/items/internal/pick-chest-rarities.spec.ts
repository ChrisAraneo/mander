import { createRandom } from '@mander/utils';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CHEST_ITEM_COUNT } from '../../consts';
import { getRarity } from './get-rarity';
import { pickChestRarities } from './pick-chest-rarities';

const pickFrom = (seed: string) =>
  pickChestRarities({ random: createRandom(seed) }).rarities;

describe('pickChestRarities', () => {
  it('should pick one rarity for each card when it fills a chest', () => {
    expect(size(pickFrom('DAY-1'))).toBe(CHEST_ITEM_COUNT);
  });

  it('should give each card the rarity of its roll when it picks the rarities', () => {
    const random = createRandom('DAY-1');

    expect(pickFrom('DAY-1')).toEqual(
      times(CHEST_ITEM_COUNT, () => getRarity(random.rollFloat())),
    );
  });

  it('should pick the same rarities when the generator starts from the same seed', () => {
    expect(pickFrom('DAY-1')).toEqual(pickFrom('DAY-1'));
  });

  it('should pick other rarities when the seed is different', () => {
    expect(
      size(
        uniq(
          map(
            times(50, (day) => pickFrom(`DAY-${day}`)),
            String,
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pass the generator on when it picks the rarities', () => {
    const random = createRandom('DAY-1');

    expect(pickChestRarities({ random }).random).toBe(random);
  });
});
