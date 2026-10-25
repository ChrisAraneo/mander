import { type Enemy } from '@mander/model';
import { filter } from 'lodash-es';
import { isArmedBeartrap } from './internal/is-armed-beartrap';
import { patchCaughtEnemies } from './internal/patch-caught-enemies';

export const patchCrushedEnemies = (enemies: Enemy[]): Enemy[] =>
  patchCaughtEnemies(enemies, filter(enemies, isArmedBeartrap));
