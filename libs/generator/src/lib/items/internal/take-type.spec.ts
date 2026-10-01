import { RED_GEM } from '@mander/model';
import { createRandom } from '@mander/utils';
import { includes, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { EVERYDAY_POOL_BY_TYPE } from '../../consts';
import { getChestType } from './get-chest-type';
import { takeType } from './take-type';

const RANDOM_SEED = 'DAY-1';

describe('takeType', () => {
  it('should add a card of the type and the rarity when the type holds one', () => {
    const { picked } = takeType(
      { picked: [], typesLeft: ['HEART', 'STAR'] },
      'HEART',
      'RARE',
      createRandom(RANDOM_SEED),
    );

    expect(map(picked, getChestType)).toEqual(['HEART']);
    expect(map(picked, 'rarity')).toEqual(['RARE']);
  });

  it('should add any card of the type when the type holds none of the rarity', () => {
    const { picked } = takeType(
      { picked: [], typesLeft: ['HEART'] },
      'HEART',
      'EPIC',
      createRandom(RANDOM_SEED),
    );

    expect(includes(EVERYDAY_POOL_BY_TYPE.HEART, picked[0])).toBe(true);
  });

  it('should add other cards when the generator starts from other seeds', () => {
    expect(
      size(
        uniq(
          times(
            30,
            (index) =>
              takeType(
                { picked: [], typesLeft: ['GEM'] },
                'GEM',
                'COMMON',
                createRandom(`DAY-${index}`),
              ).picked[0].id,
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should take the type out of the types left when it adds the card', () => {
    expect(
      takeType(
        { picked: [], typesLeft: ['HEART', 'STAR'] },
        'HEART',
        'COMMON',
        createRandom(RANDOM_SEED),
      ).typesLeft,
    ).toEqual(['STAR']);
  });

  it('should keep the cards picked before when it adds a card', () => {
    expect(
      takeType(
        { picked: [RED_GEM], typesLeft: ['HEART'] },
        'HEART',
        'COMMON',
        createRandom(RANDOM_SEED),
      ).picked[0],
    ).toBe(RED_GEM);
  });
});
