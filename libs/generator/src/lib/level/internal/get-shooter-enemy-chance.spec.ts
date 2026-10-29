import { SHOOTER_ENEMY_CHANCE } from '@mander/engine';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../../consts';
import { getShooterEnemyChance } from './get-shooter-enemy-chance';

describe('getShooterEnemyChance', () => {
  it('should hold the shooters back when the level is the first through the fifth', () => {
    expect(getShooterEnemyChance(1)).toBe(0);
    expect(getShooterEnemyChance(2)).toBe(0);
    expect(getShooterEnemyChance(3)).toBe(0);
    expect(getShooterEnemyChance(4)).toBe(0);
    expect(getShooterEnemyChance(5)).toBe(0);
  });

  it('should mix the shooters in when the level is the sixth, the seventh or the eighth', () => {
    expect(getShooterEnemyChance(6)).toBe(SHOOTER_ENEMY_CHANCE);
    expect(getShooterEnemyChance(7)).toBe(SHOOTER_ENEMY_CHANCE);
    expect(getShooterEnemyChance(8)).toBe(SHOOTER_ENEMY_CHANCE);
  });

  it('should hold the shooters back when the level is past the end of the day', () => {
    expect(getShooterEnemyChance(LEVELS_PER_DAY + 1)).toBe(0);
  });

  it('should keep the shooters to the last three levels when it is given every level', () => {
    expect(map(range(1, LEVELS_PER_DAY + 1), getShooterEnemyChance)).toEqual([
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
});
