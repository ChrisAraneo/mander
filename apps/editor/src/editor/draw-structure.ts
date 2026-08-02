import { createEnemies } from '@mander/engine';
import { TILE_SIZE } from '@mander/model';
import { drawEnemy, drawTiles, type Palette } from '@mander/render';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { forEach } from 'lodash-es';

import { drawMarker } from './draw-marker';
import { structureTileMap } from './structure-tile-map';

/**
 * A structure belongs to no world, so it has rolled no colours. With nothing to
 * shade the blocks from, the renderer falls back to its hand-picked material
 * styles — which is what the editor wants: one fixed set to draw against.
 */
const NO_PALETTE: Palette = {
  sky: ['', '', ''],
  hills: ['', ''],
  block: '',
  blockCap: '',
  blockCapHighlight: '',
};

/**
 * Paints a structure with the client's own renderer, so the editor shows the
 * exact tiles, grass caps, material textures and spikes the game will draw for
 * these cells — there is no second set of colours here to drift out of step.
 *
 * Enemies are drawn still: `createEnemies` leaves them ungrounded, so the idle
 * wobble that reads off the clock stays at rest whatever time is passed.
 *
 * Markers go on last, over the top. They build nothing, so the renderer has
 * nothing to say about them — they are the editor's own annotation.
 */
export const drawStructure = (
  context: CanvasRenderingContext2D,
  grid: number[][],
): void => {
  const level = structureTileMap(grid);
  const width = level.width * TILE_SIZE;
  const height = level.height * TILE_SIZE;

  context.clearRect(0, 0, width, height);
  drawTiles(context, level, NO_PALETTE, 0, 0, { width, height, scale: 1 });
  forEach(createEnemies(level), (enemy) => drawEnemy(context, enemy, 0));
  forEach(grid, (cells, row) =>
    forEach(cells, (cell, column) => {
      if (cell === STRUCTURE_START || cell === STRUCTURE_END)
        drawMarker(context, cell, row, column);
    }),
  );
};
