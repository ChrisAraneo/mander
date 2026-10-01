import { createRandom } from '@mander/utils';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CHEST_ITEM_COUNT } from '../../consts';
import { getRarity } from './get-rarity';
import { pickRandomChestRarities } from './pick-random-chest-rarities';

const pickRandomFrom = (seed: string) =>
  pickRandomChestRarities({ random: createRandom(seed) }).rarities;

describe('pickRandomChestRarities', () => {
  it('should pick one rarity for each card when it fills a chest', () => {
    expect(size(pickRandomFrom('DAY-1'))).toBe(CHEST_ITEM_COUNT);
  });

  it('should give each card the rarity of its roll when it picks the rarities', () => {
    const random = createRandom('DAY-1');

    expect(pickRandomFrom('DAY-1')).toEqual(
      times(CHEST_ITEM_COUNT, () => getRarity(random.rollFloat())),
    );
  });

  it('should pick the same rarities when the generator starts from the same seed', () => {
    expect(pickRandomFrom('DAY-1')).toEqual(pickRandomFrom('DAY-1'));
  });

  it('should pick other rarities when the seed is different', () => {
    expect(
      size(
        uniq(
          map(
            times(50, (day) => pickRandomFrom(`DAY-${day}`)),
            String,
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pass the generator on when it picks the rarities', () => {
    const random = createRandom('DAY-1');

    expect(pickRandomChestRarities({ random }).random).toBe(random);
  });
});
