import type { ItemRarity } from '@mander/model';
import { createRandom } from '@mander/utils';
import { every, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickRandomChestItems } from './pick-random-chest-items';

const pickRandomFrom = (seed: string, rarities: ItemRarity[], epics: number) =>
  pickRandomChestItems({ random: createRandom(seed), rarities, epics });

describe('pickRandomChestItems', () => {
  it('should pick one epic for each epic rolled when an epic turns up', () => {
    const cards = pickRandomFrom('DAY-1', ['EPIC', 'COMMON', 'EPIC'], 2);

    expect(size(cards)).toBe(2);
    expect(every(cards, { rarity: 'EPIC' })).toBe(true);
  });

  it('should pick one card for each rarity when no epic turns up', () => {
    expect(
      map(pickRandomFrom('DAY-1', ['COMMON', 'RARE', 'COMMON'], 0), 'rarity'),
    ).toEqual(['COMMON', 'RARE', 'COMMON']);
  });

  it('should pick the same cards when the generator starts from the same seed', () => {
    expect(pickRandomFrom('DAY-1', ['COMMON', 'RARE'], 0)).toEqual(
      pickRandomFrom('DAY-1', ['COMMON', 'RARE'], 0),
    );
  });

  it('should pick other cards when the generator starts from other seeds', () => {
    expect(
      size(
        uniq(
          times(30, (day) =>
            String(
              map(pickRandomFrom(`DAY-${day}`, ['COMMON', 'RARE'], 0), 'id'),
            ),
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pick nothing when there are no rarities', () => {
    expect(pickRandomFrom('DAY-1', [], 0)).toEqual([]);
  });
});
