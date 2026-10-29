import { FAST_ENEMY_CHANCE } from '@mander/engine';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../../consts';
import { getFastEnemyChance } from './get-fast-enemy-chance';

describe('getFastEnemyChance', () => {
  it('should hold the fast enemies back when the level is the first or the second', () => {
    expect(getFastEnemyChance(1)).toBe(0);
    expect(getFastEnemyChance(2)).toBe(0);
  });

  it('should mix the fast enemies in when the level is the third or later', () => {
    expect(getFastEnemyChance(3)).toBe(FAST_ENEMY_CHANCE);
    expect(getFastEnemyChance(8)).toBe(FAST_ENEMY_CHANCE);
  });

  it('should hold the fast enemies back when the level is past the end of the day', () => {
    expect(getFastEnemyChance(LEVELS_PER_DAY + 1)).toBe(0);
  });

  it('should keep the fast enemies out of the first two levels when it is given every level', () => {
    expect(map(range(1, LEVELS_PER_DAY + 1), getFastEnemyChance)).toEqual([
      0,
      0,
      FAST_ENEMY_CHANCE,
      FAST_ENEMY_CHANCE,
      FAST_ENEMY_CHANCE,
      FAST_ENEMY_CHANCE,
      FAST_ENEMY_CHANCE,
      FAST_ENEMY_CHANCE,
    ]);
  });
});
