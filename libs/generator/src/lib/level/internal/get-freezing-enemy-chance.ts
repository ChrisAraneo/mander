import { FREEZING_ENEMY_CHANCE } from '@mander/engine';
import type { Season } from '@mander/model';

const NO_FREEZING_ENEMIES = 0;

const WINTER_FREEZING_ENEMY_CHANCES: readonly number[] = Object.freeze([
  0,
  0,
  FREEZING_ENEMY_CHANCE,
  FREEZING_ENEMY_CHANCE,
  FREEZING_ENEMY_CHANCE,
  FREEZING_ENEMY_CHANCE,
  FREEZING_ENEMY_CHANCE,
  FREEZING_ENEMY_CHANCE,
]);

const WITHOUT_FREEZING_ENEMIES: readonly number[] = Object.freeze([]);

const FREEZING_ENEMY_CHANCES: Readonly<Record<Season, readonly number[]>> =
  Object.freeze({
    SPRING: WITHOUT_FREEZING_ENEMIES,
    SUMMER: WITHOUT_FREEZING_ENEMIES,
    AUTUMN: WITHOUT_FREEZING_ENEMIES,
    WINTER: WINTER_FREEZING_ENEMY_CHANCES,
  });

export const getFreezingEnemyChance = (
  levelNumber: number,
  season: Season,
): number =>
  FREEZING_ENEMY_CHANCES[season][levelNumber - 1] ?? NO_FREEZING_ENEMIES;
