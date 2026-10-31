import { HORNED_ENEMY_CHANCE } from '@mander/engine';
import type { Season } from '@mander/model';

const NO_HORNED_ENEMIES = 0;

const ONLY_HORNED_ENEMIES = 1;

const SUMMER_HORNED_ENEMY_CHANCES: readonly number[] = Object.freeze([
  0,
  0,
  HORNED_ENEMY_CHANCE,
  HORNED_ENEMY_CHANCE,
  HORNED_ENEMY_CHANCE,
  ONLY_HORNED_ENEMIES,
  ONLY_HORNED_ENEMIES,
  ONLY_HORNED_ENEMIES,
]);

const WITHOUT_HORNED_ENEMIES: readonly number[] = Object.freeze([]);

const HORNED_ENEMY_CHANCES: Readonly<Record<Season, readonly number[]>> =
  Object.freeze({
    SPRING: WITHOUT_HORNED_ENEMIES,
    SUMMER: SUMMER_HORNED_ENEMY_CHANCES,
    AUTUMN: WITHOUT_HORNED_ENEMIES,
    WINTER: WITHOUT_HORNED_ENEMIES,
  });

export const getHornedEnemyChance = (
  levelNumber: number,
  season: Season,
): number => HORNED_ENEMY_CHANCES[season][levelNumber - 1] ?? NO_HORNED_ENEMIES;
