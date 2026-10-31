import { FREEZING_ENEMY_CHANCE } from '@mander/engine';

const FREEZING_ENEMY_CHANCES: readonly number[] = Object.freeze([
  0,
  0,
  0,
  0,
  0,
  0,
  FREEZING_ENEMY_CHANCE,
  FREEZING_ENEMY_CHANCE,
]);

const NO_FREEZING_ENEMIES = 0;

export const getFreezingEnemyChance = (levelNumber: number): number =>
  FREEZING_ENEMY_CHANCES[levelNumber - 1] ?? NO_FREEZING_ENEMIES;
