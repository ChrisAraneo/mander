import { HORNED_ENEMY_CHANCE } from '@mander/engine';
import type { Season } from '@mander/model';
import { constant, map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../../consts';
import { getHornedEnemyChance } from './get-horned-enemy-chance';

const SUMMER: Season = 'SUMMER';

const NO_HORNED_ENEMIES_ALL_DAY = times(LEVELS_PER_DAY, constant(0));

const takeEveryLevelOf = (season: Season): number[] =>
  map(range(1, LEVELS_PER_DAY + 1), (levelNumber) =>
    getHornedEnemyChance(levelNumber, season),
  );

describe('getHornedEnemyChance', () => {
  it('should hold the horned enemies back when the level is the first or the second', () => {
    expect(getHornedEnemyChance(1, SUMMER)).toBe(0);
    expect(getHornedEnemyChance(2, SUMMER)).toBe(0);
  });

  it('should mix the horned enemies in when the level is the third through the fifth', () => {
    expect(getHornedEnemyChance(3, SUMMER)).toBe(HORNED_ENEMY_CHANCE);
    expect(getHornedEnemyChance(4, SUMMER)).toBe(HORNED_ENEMY_CHANCE);
    expect(getHornedEnemyChance(5, SUMMER)).toBe(HORNED_ENEMY_CHANCE);
  });

  it('should send only horned enemies when the level is the sixth or later', () => {
    expect(getHornedEnemyChance(6, SUMMER)).toBe(1);
    expect(getHornedEnemyChance(8, SUMMER)).toBe(1);
  });

  it('should hold the horned enemies back when the level is past the end of the day', () => {
    expect(getHornedEnemyChance(LEVELS_PER_DAY + 1, SUMMER)).toBe(0);
  });

  it('should ramp the horned enemies up over the day when the world is a summer one', () => {
    expect(takeEveryLevelOf(SUMMER)).toEqual([
      0,
      0,
      HORNED_ENEMY_CHANCE,
      HORNED_ENEMY_CHANCE,
      HORNED_ENEMY_CHANCE,
      1,
      1,
      1,
    ]);
  });

  it('should keep the horned enemies out of the whole day when the world is a spring one', () => {
    expect(takeEveryLevelOf('SPRING')).toEqual(NO_HORNED_ENEMIES_ALL_DAY);
  });

  it('should keep the horned enemies out of the whole day when the world is an autumn one', () => {
    expect(takeEveryLevelOf('AUTUMN')).toEqual(NO_HORNED_ENEMIES_ALL_DAY);
  });

  it('should keep the horned enemies out of the whole day when the world is a winter one', () => {
    expect(takeEveryLevelOf('WINTER')).toEqual(NO_HORNED_ENEMIES_ALL_DAY);
  });
});
