import { createRandom } from '@mander/utils';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { dealChest } from './deal-chest';
import { getChestType } from './get-chest-type';

describe('dealChest', () => {
  it('should deal one card for each rarity when it fills a chest', () => {
    expect(
      map(
        dealChest(['COMMON', 'RARE', 'COMMON'], createRandom('DAY-1')),
        'rarity',
      ),
    ).toEqual(['COMMON', 'RARE', 'COMMON']);
  });

  it('should deal each card a type of its own when it fills a chest', () => {
    const cards = dealChest(
      ['COMMON', 'COMMON', 'COMMON'],
      createRandom('DAY-1'),
    );

    expect(size(uniq(map(cards, getChestType)))).toBe(3);
  });

  it('should keep the gear out when it fills an everyday chest', () => {
    expect(
      map(
        dealChest(['COMMON', 'RARE', 'COMMON'], createRandom('DAY-2')),
        getChestType,
      ),
    ).not.toContain('GEAR');
  });

  it('should fill the chest the same way when the generator starts from the same seed', () => {
    expect(dealChest(['COMMON', 'RARE'], createRandom('DAY-1'))).toEqual(
      dealChest(['COMMON', 'RARE'], createRandom('DAY-1')),
    );
  });

  it('should fill the chest another way when the generator starts from another seed', () => {
    expect(
      size(
        uniq(
          times(30, (index) =>
            String(
              map(
                dealChest(['COMMON', 'RARE'], createRandom(`DAY-${index}`)),
                'id',
              ),
            ),
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should deal nothing when there are no rarities', () => {
    expect(dealChest([], createRandom('DAY-1'))).toEqual([]);
  });
});
