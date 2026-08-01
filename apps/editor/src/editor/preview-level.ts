import {
  structureEnemies,
  structureTileMap,
  type Structure,
} from '@mander/structures';
import type { Level } from '@mander/engine';
import { map } from 'lodash-es';

/**
 * The grid as the game would see it: real tiles, real enemy spawns. Feeding
 * this to the same renderer the client uses is what keeps the preview honest —
 * a material only has to be drawn once, here, for both to agree.
 *
 * `structureTileMap` turns enemy cells into air, which is right: an enemy is
 * not a tile, it stands on the one below and is drawn on top.
 */
export const previewLevel = (grid: Structure): Level => ({
  ...structureTileMap(grid),
  enemies: map(structureEnemies(grid), (cell) => ({
    x: cell.col,
    y: cell.row,
  })),
});
