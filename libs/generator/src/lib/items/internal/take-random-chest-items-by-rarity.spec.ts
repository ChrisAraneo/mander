import type { ItemRarity } from '@mander/model';
import { createRandom } from '@mander/utils';
import { every, map, size, times, toString, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { takeRandomChestItemsByRarity } from './take-random-chest-items-by-rarity';

const takeRandomFrom = (seed: string, rarities: ItemRarity[], epics: number) =>
  takeRandomChestItemsByRarity({ rarities, epics, random: createRandom(seed) });

describe('takeRandomChestItemsByRarity', () => {
  it('should pick one epic for each epic rolled when an epic turns up', () => {
    const cards = takeRandomFrom('DAY-1', ['EPIC', 'COMMON', 'EPIC'], 2);

    expect(size(cards)).toBe(2);
    expect(every(cards, { rarity: 'EPIC' })).toBe(true);
  });

  it('should pick one card for each rarity when no epic turns up', () => {
    expect(
      map(takeRandomFrom('DAY-1', ['COMMON', 'RARE', 'COMMON'], 0), 'rarity'),
    ).toEqual(['COMMON', 'RARE', 'COMMON']);
  });

  it('should pick the same cards when the generator starts from the same seed', () => {
    expect(takeRandomFrom('DAY-1', ['COMMON', 'RARE'], 0)).toEqual(
      takeRandomFrom('DAY-1', ['COMMON', 'RARE'], 0),
    );
  });

  it('should pick other cards when the generator starts from other seeds', () => {
    expect(
      size(
        uniq(
          times(30, (day) =>
            toString(
              map(takeRandomFrom(`DAY-${day}`, ['COMMON', 'RARE'], 0), 'id'),
            ),
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pick nothing when there are no rarities', () => {
    expect(takeRandomFrom('DAY-1', [], 0)).toEqual([]);
  });
});
