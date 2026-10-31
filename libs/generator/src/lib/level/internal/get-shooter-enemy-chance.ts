import { SHOOTER_ENEMY_CHANCE } from '@mander/engine';
import type { Season } from '@mander/model';

const NO_SHOOTER_ENEMIES = 0;

const AUTUMN_SHOOTER_ENEMY_CHANCES: readonly number[] = Object.freeze([
  0,
  0,
  0,
  0,
  0,
  SHOOTER_ENEMY_CHANCE,
  SHOOTER_ENEMY_CHANCE,
  SHOOTER_ENEMY_CHANCE,
]);

const WITHOUT_SHOOTER_ENEMIES: readonly number[] = Object.freeze([]);

const SHOOTER_ENEMY_CHANCES: Readonly<Record<Season, readonly number[]>> =
  Object.freeze({
    SPRING: WITHOUT_SHOOTER_ENEMIES,
    SUMMER: WITHOUT_SHOOTER_ENEMIES,
    AUTUMN: AUTUMN_SHOOTER_ENEMY_CHANCES,
    WINTER: WITHOUT_SHOOTER_ENEMIES,
  });

export const getShooterEnemyChance = (
  levelNumber: number,
  season: Season,
): number =>
  SHOOTER_ENEMY_CHANCES[season][levelNumber - 1] ?? NO_SHOOTER_ENEMIES;
