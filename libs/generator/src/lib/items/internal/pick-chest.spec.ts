import { createRandom } from '@mander/utils';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickChest } from './pick-chest';
import { getChestType } from './get-chest-type';

describe('pickChest', () => {
  it('should pick one card for each rarity when it fills a chest', () => {
    expect(
      map(
        pickChest(['COMMON', 'RARE', 'COMMON'], createRandom('DAY-1')),
        'rarity',
      ),
    ).toEqual(['COMMON', 'RARE', 'COMMON']);
  });

  it('should pick a type of its own for each card when it fills a chest', () => {
    const cards = pickChest(
      ['COMMON', 'COMMON', 'COMMON'],
      createRandom('DAY-1'),
    );

    expect(size(uniq(map(cards, getChestType)))).toBe(3);
  });

  it('should keep the gear out when it fills an everyday chest', () => {
    expect(
      map(
        pickChest(['COMMON', 'RARE', 'COMMON'], createRandom('DAY-2')),
        getChestType,
      ),
    ).not.toContain('GEAR');
  });

  it('should fill the chest the same way when the generator starts from the same seed', () => {
    expect(pickChest(['COMMON', 'RARE'], createRandom('DAY-1'))).toEqual(
      pickChest(['COMMON', 'RARE'], createRandom('DAY-1')),
    );
  });

  it('should fill the chest another way when the generator starts from another seed', () => {
    expect(
      size(
        uniq(
          times(30, (index) =>
            String(
              map(
                pickChest(['COMMON', 'RARE'], createRandom(`DAY-${index}`)),
                'id',
              ),
            ),
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pick nothing when there are no rarities', () => {
    expect(pickChest([], createRandom('DAY-1'))).toEqual([]);
  });
});
