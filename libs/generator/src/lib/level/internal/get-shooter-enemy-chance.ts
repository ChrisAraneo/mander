import { SHOOTER_ENEMY_CHANCE } from '@mander/engine';

const SHOOTER_ENEMY_CHANCES: readonly number[] = Object.freeze([
  0,
  0,
  0,
  0,
  0,
  SHOOTER_ENEMY_CHANCE,
  SHOOTER_ENEMY_CHANCE,
  SHOOTER_ENEMY_CHANCE,
]);

const NO_SHOOTER_ENEMIES = 0;

export const getShooterEnemyChance = (levelNumber: number): number =>
  SHOOTER_ENEMY_CHANCES[levelNumber - 1] ?? NO_SHOOTER_ENEMIES;
