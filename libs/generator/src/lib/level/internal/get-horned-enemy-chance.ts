import { HORNED_ENEMY_CHANCE } from '@mander/engine';
import { match, P } from 'ts-pattern';
import {
  FIRST_HORNED_ENEMY_LEVEL,
  FIRST_MIXED_ENEMY_LEVEL,
  NO_HORNED_ENEMIES,
  ONLY_HORNED_ENEMIES,
} from '../../consts';

const { number } = P;

export const getHornedEnemyChance = (levelNumber: number): number =>
  match(levelNumber)
    .with(number.gte(FIRST_HORNED_ENEMY_LEVEL), () => ONLY_HORNED_ENEMIES)
    .with(number.gte(FIRST_MIXED_ENEMY_LEVEL), () => HORNED_ENEMY_CHANCE)
    .otherwise(() => NO_HORNED_ENEMIES);
