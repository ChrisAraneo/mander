import { FAST_ENEMY_CHANCE } from '@mander/engine';
import type { Season } from '@mander/model';
import { constant, map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../../consts';
import { getFastEnemyChance } from './get-fast-enemy-chance';

const SPRING: Season = 'SPRING';

const NO_FAST_ENEMIES_ALL_DAY = times(LEVELS_PER_DAY, constant(0));

const takeEveryLevelOf = (season: Season): number[] =>
  map(range(1, LEVELS_PER_DAY + 1), (levelNumber) =>
    getFastEnemyChance(levelNumber, season),
  );

describe('getFastEnemyChance', () => {
  it('should hold the fast enemies back when the level is the first or the second', () => {
    expect(getFastEnemyChance(1, SPRING)).toBe(0);
    expect(getFastEnemyChance(2, SPRING)).toBe(0);
  });

  it('should mix the fast enemies in when the level is the third or later', () => {
    expect(getFastEnemyChance(3, SPRING)).toBe(FAST_ENEMY_CHANCE);
    expect(getFastEnemyChance(8, SPRING)).toBe(FAST_ENEMY_CHANCE);
  });

  it('should hold the fast enemies back when the level is past the end of the day', () => {
    expect(getFastEnemyChance(LEVELS_PER_DAY + 1, SPRING)).toBe(0);
  });

  it('should keep the fast enemies out of the first two levels when the world is a spring one', () => {
    expect(takeEveryLevelOf(SPRING)).toEqual([
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

  it('should keep the fast enemies out of the whole day when the world is a summer one', () => {
    expect(takeEveryLevelOf('SUMMER')).toEqual(NO_FAST_ENEMIES_ALL_DAY);
  });

  it('should keep the fast enemies out of the whole day when the world is an autumn one', () => {
    expect(takeEveryLevelOf('AUTUMN')).toEqual(NO_FAST_ENEMIES_ALL_DAY);
  });

  it('should keep the fast enemies out of the whole day when the world is a winter one', () => {
    expect(takeEveryLevelOf('WINTER')).toEqual(NO_FAST_ENEMIES_ALL_DAY);
  });
});
