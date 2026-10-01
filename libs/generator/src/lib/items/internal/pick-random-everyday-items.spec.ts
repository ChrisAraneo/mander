import { createRandom } from '@mander/utils';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickRandomEverydayItems } from './pick-random-everyday-items';
import { getChestType } from './get-chest-type';

describe('pickRandomEverydayItems', () => {
  it('should pick one card for each rarity when it fills a chest', () => {
    expect(
      map(
        pickRandomEverydayItems(
          ['COMMON', 'RARE', 'COMMON'],
          createRandom('DAY-1'),
        ),
        'rarity',
      ),
    ).toEqual(['COMMON', 'RARE', 'COMMON']);
  });

  it('should pick a type of its own for each card when it fills a chest', () => {
    const cards = pickRandomEverydayItems(
      ['COMMON', 'COMMON', 'COMMON'],
      createRandom('DAY-1'),
    );

    expect(size(uniq(map(cards, getChestType)))).toBe(3);
  });

  it('should keep the gear out when it fills an everyday chest', () => {
    expect(
      map(
        pickRandomEverydayItems(
          ['COMMON', 'RARE', 'COMMON'],
          createRandom('DAY-2'),
        ),
        getChestType,
      ),
    ).not.toContain('GEAR');
  });

  it('should fill the chest the same way when the generator starts from the same seed', () => {
    expect(
      pickRandomEverydayItems(['COMMON', 'RARE'], createRandom('DAY-1')),
    ).toEqual(
      pickRandomEverydayItems(['COMMON', 'RARE'], createRandom('DAY-1')),
    );
  });

  it('should fill the chest another way when the generator starts from another seed', () => {
    expect(
      size(
        uniq(
          times(30, (index) =>
            String(
              map(
                pickRandomEverydayItems(
                  ['COMMON', 'RARE'],
                  createRandom(`DAY-${index}`),
                ),
                'id',
              ),
            ),
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pick nothing when there are no rarities', () => {
    expect(pickRandomEverydayItems([], createRandom('DAY-1'))).toEqual([]);
  });
});
