import { createRandom } from '@mander/utils';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickCard } from './pick-card';
import { getChestType } from './get-chest-type';

describe('pickCard', () => {
  it('should pick a card of a type that holds the rarity when one is left', () => {
    times(20, (index) => {
      const { picked } = pickCard(
        { picked: [], typesLeft: ['GEAR', 'HEART'] },
        'RARE',
        createRandom(`DAY-${index}`),
      );

      expect(map(picked, getChestType), `day ${index}`).toEqual(['HEART']);
    });
  });

  it('should take the type of the card out of the types left when it picks the card', () => {
    const { picked, typesLeft } = pickCard(
      { picked: [], typesLeft: ['GEM', 'HEART', 'STAR'] },
      'COMMON',
      createRandom('DAY-1'),
    );

    expect(typesLeft).not.toContain(getChestType(picked[0]));
    expect(typesLeft).toHaveLength(2);
  });

  it('should pick the same card when the generator starts from the same seed', () => {
    expect(
      pickCard(
        { picked: [], typesLeft: ['GEM', 'HEART', 'STAR'] },
        'COMMON',
        createRandom('DAY-1'),
      ),
    ).toEqual(
      pickCard(
        { picked: [], typesLeft: ['GEM', 'HEART', 'STAR'] },
        'COMMON',
        createRandom('DAY-1'),
      ),
    );
  });

  it('should pick other cards when the generator starts from other seeds', () => {
    expect(
      size(
        uniq(
          times(
            30,
            (index) =>
              pickCard(
                { picked: [], typesLeft: ['GEM', 'HEART', 'STAR'] },
                'COMMON',
                createRandom(`DAY-${index}`),
              ).picked[0].id,
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });
});
