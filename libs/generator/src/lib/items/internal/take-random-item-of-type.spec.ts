import { createRandom } from '@mander/common';
import { RED_GEM } from '@mander/model';
import { map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findChestType } from './find-chest-type';
import { takeRandomItemOfType } from './take-random-item-of-type';
import type { ChestPicking } from './types/chest-picking';

const RANDOM_SEED = 'DAY-1';

const SEEDS_TRIED = 30;

const HEART_AND_STAR: ChestPicking = {
  picked: [],
  typesLeft: ['HEART', 'STAR'],
};

describe('takeRandomItemOfType', () => {
  it('should add a card of the type and the rarity when the type holds one', () => {
    const { picked } = takeRandomItemOfType(
      HEART_AND_STAR,
      'HEART',
      'RARE',
      createRandom(RANDOM_SEED),
    );

    expect(map(picked, findChestType)).toEqual(['HEART']);
    expect(map(picked, (item) => item.rarity)).toEqual(['RARE']);
  });

  it('should add other cards when the generator starts from other seeds', () => {
    expect(
      size(
        uniq(
          times(
            SEEDS_TRIED,
            (index) =>
              takeRandomItemOfType(
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
      takeRandomItemOfType(
        HEART_AND_STAR,
        'HEART',
        'COMMON',
        createRandom(RANDOM_SEED),
      ).typesLeft,
    ).toEqual(['STAR']);
  });

  it('should keep the cards picked before when it adds a card', () => {
    expect(
      takeRandomItemOfType(
        { picked: [RED_GEM], typesLeft: ['HEART'] },
        'HEART',
        'COMMON',
        createRandom(RANDOM_SEED),
      ).picked[0],
    ).toBe(RED_GEM);
  });

  it('should add the same card when the generator starts from the same seed', () => {
    expect(
      takeRandomItemOfType(
        { picked: [], typesLeft: ['GEM', 'STAR'] },
        'GEM',
        'COMMON',
        createRandom(RANDOM_SEED),
      ),
    ).toEqual(
      takeRandomItemOfType(
        { picked: [], typesLeft: ['GEM', 'STAR'] },
        'GEM',
        'COMMON',
        createRandom(RANDOM_SEED),
      ),
    );
  });
});
