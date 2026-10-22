import { HORNED_ENEMY_CHANCE } from '@mander/engine';

const HORNED_ENEMY_CHANCES: readonly number[] = Object.freeze([
  0,
  0,
  HORNED_ENEMY_CHANCE,
  HORNED_ENEMY_CHANCE,
  HORNED_ENEMY_CHANCE,
  1,
  1,
  1,
]);

const NO_HORNED_ENEMIES = 0;

export const getHornedEnemyChance = (levelNumber: number): number =>
  HORNED_ENEMY_CHANCES[levelNumber - 1] ?? NO_HORNED_ENEMIES;
