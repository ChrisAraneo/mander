import { SHOOTER_ENEMY_CHANCE } from '@mander/engine';
import type { Season } from '@mander/model';
import { constant, map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../../consts';
import { getShooterEnemyChance } from './get-shooter-enemy-chance';

const AUTUMN: Season = 'AUTUMN';

const NO_SHOOTERS_ALL_DAY = times(LEVELS_PER_DAY, constant(0));

const takeEveryLevelOf = (season: Season): number[] =>
  map(range(1, LEVELS_PER_DAY + 1), (levelNumber) =>
    getShooterEnemyChance(levelNumber, season),
  );

describe('getShooterEnemyChance', () => {
  it('should hold the shooters back when the level is the first through the fifth', () => {
    expect(getShooterEnemyChance(1, AUTUMN)).toBe(0);
    expect(getShooterEnemyChance(2, AUTUMN)).toBe(0);
    expect(getShooterEnemyChance(3, AUTUMN)).toBe(0);
    expect(getShooterEnemyChance(4, AUTUMN)).toBe(0);
    expect(getShooterEnemyChance(5, AUTUMN)).toBe(0);
  });

  it('should mix the shooters in when the level is the sixth, the seventh or the eighth', () => {
    expect(getShooterEnemyChance(6, AUTUMN)).toBe(SHOOTER_ENEMY_CHANCE);
    expect(getShooterEnemyChance(7, AUTUMN)).toBe(SHOOTER_ENEMY_CHANCE);
    expect(getShooterEnemyChance(8, AUTUMN)).toBe(SHOOTER_ENEMY_CHANCE);
  });

  it('should hold the shooters back when the level is past the end of the day', () => {
    expect(getShooterEnemyChance(LEVELS_PER_DAY + 1, AUTUMN)).toBe(0);
  });

  it('should keep the shooters to the last three levels when the world is an autumn one', () => {
    expect(takeEveryLevelOf(AUTUMN)).toEqual([
      0,
      0,
      0,
      0,
      0,
      SHOOTER_ENEMY_CHANCE,
      SHOOTER_ENEMY_CHANCE,
      SHOOTER_ENEMY_CHANCE,
    ]);
  });

  it('should keep the shooters out of the whole day when the world is a spring one', () => {
    expect(takeEveryLevelOf('SPRING')).toEqual(NO_SHOOTERS_ALL_DAY);
  });

  it('should keep the shooters out of the whole day when the world is a summer one', () => {
    expect(takeEveryLevelOf('SUMMER')).toEqual(NO_SHOOTERS_ALL_DAY);
  });

  it('should keep the shooters out of the whole day when the world is a winter one', () => {
    expect(takeEveryLevelOf('WINTER')).toEqual(NO_SHOOTERS_ALL_DAY);
  });
});
