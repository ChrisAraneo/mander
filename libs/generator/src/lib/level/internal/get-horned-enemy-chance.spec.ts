import { HORNED_ENEMY_CHANCE } from '@mander/engine';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../../consts';
import { getHornedEnemyChance } from './get-horned-enemy-chance';

describe('getHornedEnemyChance', () => {
  it('should hold the horned enemies back when the level is the first or the second', () => {
    expect(getHornedEnemyChance(1)).toBe(0);
    expect(getHornedEnemyChance(2)).toBe(0);
  });

  it('should mix the horned enemies in when the level is the third through the fifth', () => {
    expect(getHornedEnemyChance(3)).toBe(HORNED_ENEMY_CHANCE);
    expect(getHornedEnemyChance(4)).toBe(HORNED_ENEMY_CHANCE);
    expect(getHornedEnemyChance(5)).toBe(HORNED_ENEMY_CHANCE);
  });

  it('should send only horned enemies when the level is the sixth or later', () => {
    expect(getHornedEnemyChance(6)).toBe(1);
    expect(getHornedEnemyChance(8)).toBe(1);
  });

  it('should ramp the horned enemies up over the day when it is given every level', () => {
    expect(map(range(1, LEVELS_PER_DAY + 1), getHornedEnemyChance)).toEqual([
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
});
