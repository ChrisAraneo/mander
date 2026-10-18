import { HORNED_ENEMY_CHANCE } from '@mander/engine';
import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  FIRST_HORNED_ENEMY_LEVEL,
  FIRST_MIXED_ENEMY_LEVEL,
  LEVELS_PER_DAY,
  NO_HORNED_ENEMIES,
  ONLY_HORNED_ENEMIES,
} from '../../consts';
import { getHornedEnemyChance } from './get-horned-enemy-chance';

describe('getHornedEnemyChance', () => {
  it('should hold the horned enemies back when the level comes before the mixed ones', () => {
    expect(
      map(range(1, FIRST_MIXED_ENEMY_LEVEL), getHornedEnemyChance),
    ).toEqual(map(range(1, FIRST_MIXED_ENEMY_LEVEL), () => NO_HORNED_ENEMIES));
  });

  it('should mix the horned enemies in when the level is one of the mixed ones', () => {
    expect(
      map(
        range(FIRST_MIXED_ENEMY_LEVEL, FIRST_HORNED_ENEMY_LEVEL),
        getHornedEnemyChance,
      ),
    ).toEqual(
      map(
        range(FIRST_MIXED_ENEMY_LEVEL, FIRST_HORNED_ENEMY_LEVEL),
        () => HORNED_ENEMY_CHANCE,
      ),
    );
  });

  it('should send only horned enemies when the level is one of the last of the day', () => {
    expect(
      map(
        range(FIRST_HORNED_ENEMY_LEVEL, LEVELS_PER_DAY + 1),
        getHornedEnemyChance,
      ),
    ).toEqual(
      map(
        range(FIRST_HORNED_ENEMY_LEVEL, LEVELS_PER_DAY + 1),
        () => ONLY_HORNED_ENEMIES,
      ),
    );
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
