import { createRandom } from '@mander/common';
import { size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findChestType } from './find-chest-type';
import { takeRandomItem } from './take-random-item';
import type { ChestPicking } from './types/chest-picking';

const SEEDS_TRIED = 30;

const createPicking = (): ChestPicking => ({
  picked: [],
  typesLeft: ['GEM', 'HEART', 'STAR'],
});

const TYPES_LEFT_AFTER_ONE = 2;

describe('takeRandomItem', () => {
  it('should take the type of the card out of the types left when it picks the card', () => {
    const { picked, typesLeft } = takeRandomItem(
      createPicking(),
      'COMMON',
      createRandom('DAY-1'),
    );

    expect(typesLeft).not.toContain(findChestType(picked[0]));
    expect(typesLeft).toHaveLength(TYPES_LEFT_AFTER_ONE);
  });

  it('should pick the same card when the generator starts from the same seed', () => {
    expect(
      takeRandomItem(createPicking(), 'COMMON', createRandom('DAY-1')),
    ).toEqual(takeRandomItem(createPicking(), 'COMMON', createRandom('DAY-1')));
  });

  it('should pick other cards when the generator starts from other seeds', () => {
    expect(
      size(
        uniq(
          times(
            SEEDS_TRIED,
            (index) =>
              takeRandomItem(
                createPicking(),
                'COMMON',
                createRandom(`DAY-${index}`),
              ).picked[0].id,
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });
});
