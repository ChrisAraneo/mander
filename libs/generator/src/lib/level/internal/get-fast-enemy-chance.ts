import { FAST_ENEMY_CHANCE } from '@mander/engine';

const FAST_ENEMY_CHANCES: readonly number[] = Object.freeze([
  0,
  0,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_CHANCE,
]);

const NO_FAST_ENEMIES = 0;

export const getFastEnemyChance = (levelNumber: number): number =>
  FAST_ENEMY_CHANCES[levelNumber - 1] ?? NO_FAST_ENEMIES;
