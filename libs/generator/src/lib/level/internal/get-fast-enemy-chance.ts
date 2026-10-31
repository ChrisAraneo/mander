import { FAST_ENEMY_CHANCE } from '@mander/engine';
import type { Season } from '@mander/model';

const NO_FAST_ENEMIES = 0;

const SPRING_FAST_ENEMY_CHANCES: readonly number[] = Object.freeze([
  0,
  0,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
]);

const WITHOUT_FAST_ENEMIES: readonly number[] = Object.freeze([]);

const FAST_ENEMY_CHANCES: Readonly<Record<Season, readonly number[]>> =
  Object.freeze({
    SPRING: SPRING_FAST_ENEMY_CHANCES,
    SUMMER: WITHOUT_FAST_ENEMIES,
    AUTUMN: WITHOUT_FAST_ENEMIES,
    WINTER: WITHOUT_FAST_ENEMIES,
  });

export const getFastEnemyChance = (
  levelNumber: number,
  season: Season,
): number => FAST_ENEMY_CHANCES[season][levelNumber - 1] ?? NO_FAST_ENEMIES;
