import { createRandom } from '@mander/utils';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CHEST_ITEM_COUNT } from '../../consts';
import { rollRarities } from './roll-rarities';

const rollFrom = (seed: string) => rollRarities(createRandom(seed));

describe('rollRarities', () => {
  it('should roll one rarity for each card when it fills a chest', () => {
    expect(size(rollFrom('DAY-1'))).toBe(CHEST_ITEM_COUNT);
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
});
