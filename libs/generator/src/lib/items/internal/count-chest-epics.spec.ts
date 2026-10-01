import type { ItemRarity } from '@mander/model';
import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { countChestEpics } from './count-chest-epics';

const RANDOM = createRandom('DAY-1');

const countIn = (rarities: ItemRarity[]) =>
  countChestEpics({ random: RANDOM, rarities }).epics;

describe('countChestEpics', () => {
  it('should count the epic rarities when some turn up', () => {
    expect(countIn(['EPIC', 'COMMON', 'EPIC'])).toBe(2);
  });

  it('should count nothing when no epic turns up', () => {
    expect(countIn(['COMMON', 'RARE'])).toBe(0);
  });

  it('should count nothing when there are no rarities', () => {
    expect(countIn([])).toBe(0);
  });

  it('should pass the generator on when it counts the epics', () => {
    expect(countChestEpics({ random: RANDOM, rarities: [] }).random).toBe(
      RANDOM,
    );
  });

  it('should pass the rarities on when it counts the epics', () => {
    const rarities: ItemRarity[] = ['EPIC', 'COMMON'];

    expect(countChestEpics({ random: RANDOM, rarities }).rarities).toBe(
      rarities,
    );
  });
});
