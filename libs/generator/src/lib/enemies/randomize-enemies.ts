import type { Random } from '@mander/engine';
import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import type { EnemyChances } from '../types/enemy-chances';
import { createEnemyPatches } from './internal/create-enemy-patches';
import { filterEnemyCells } from './internal/filter-enemy-cells';
import { patchEnemyTiles } from './internal/patch-enemy-tiles';

export const randomizeEnemies = (
  tiles: Tile[][],
  chances: EnemyChances,
  random: Random,
): Tile[][] =>
  pipe(
    { tiles, chances, random },
    filterEnemyCells,
    createEnemyPatches,
    patchEnemyTiles,
  );
