import type { Level } from '@mander/model';

import { structureEnemies } from './structure-enemies';
import { structureTileMap } from './structure-tile-map';

/**
 * The grid as the game would see it: real tiles, real enemy spawns. Feeding
 * this to the same renderer the client uses is what keeps the preview honest —
 * a material only has to be drawn once, here, for both to agree.
 */
export const previewLevel = (grid: number[][]): Level => ({
  ...structureTileMap(grid),
  enemies: structureEnemies(grid),
});
