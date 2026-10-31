import { FREEZING_ENEMY_CHANCE } from '@mander/engine';
import type { Season } from '@mander/model';
import { constant, map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../../consts';
import { getFreezingEnemyChance } from './get-freezing-enemy-chance';

const WINTER: Season = 'WINTER';

const NO_FREEZING_ENEMIES_ALL_DAY = times(LEVELS_PER_DAY, constant(0));

const takeEveryLevelOf = (season: Season): number[] =>
  map(range(1, LEVELS_PER_DAY + 1), (levelNumber) =>
    getFreezingEnemyChance(levelNumber, season),
  );

describe('getFreezingEnemyChance', () => {
  it('should hold the freezing enemies back when the level is the first or the second', () => {
    expect(getFreezingEnemyChance(1, WINTER)).toBe(0);
    expect(getFreezingEnemyChance(2, WINTER)).toBe(0);
  });

  it('should mix the freezing enemies in when the level is the third or later', () => {
    expect(getFreezingEnemyChance(3, WINTER)).toBe(FREEZING_ENEMY_CHANCE);
    expect(getFreezingEnemyChance(8, WINTER)).toBe(FREEZING_ENEMY_CHANCE);
  });

  it('should hold the freezing enemies back when the level is past the end of the day', () => {
    expect(getFreezingEnemyChance(LEVELS_PER_DAY + 1, WINTER)).toBe(0);
  });

  it('should keep the freezing enemies out of the first two levels when the world is a winter one', () => {
    expect(takeEveryLevelOf(WINTER)).toEqual([
      0,
      0,
      FREEZING_ENEMY_CHANCE,
      FREEZING_ENEMY_CHANCE,
      FREEZING_ENEMY_CHANCE,
      FREEZING_ENEMY_CHANCE,
      FREEZING_ENEMY_CHANCE,
      FREEZING_ENEMY_CHANCE,
    ]);
  });

  it('should keep the freezing enemies out of the whole day when the world is a spring one', () => {
    expect(takeEveryLevelOf('SPRING')).toEqual(NO_FREEZING_ENEMIES_ALL_DAY);
  });

  it('should keep the freezing enemies out of the whole day when the world is a summer one', () => {
    expect(takeEveryLevelOf('SUMMER')).toEqual(NO_FREEZING_ENEMIES_ALL_DAY);
  });

  it('should keep the freezing enemies out of the whole day when the world is an autumn one', () => {
    expect(takeEveryLevelOf('AUTUMN')).toEqual(NO_FREEZING_ENEMIES_ALL_DAY);
  });
});
