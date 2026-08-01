import { createEnemies } from '@mander/engine';
import { TILE_SIZE } from '@mander/model';
import { drawEnemy, drawTiles } from '@mander/render';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { forEach } from 'lodash-es';

import { drawMarker } from './draw-marker';
import { previewLevel } from './preview-level';

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
  const level = previewLevel(grid);
  const width = level.width * TILE_SIZE;
  const height = level.height * TILE_SIZE;

  context.clearRect(0, 0, width, height);
  drawTiles(context, level, 0, 0, { width, height, scale: 1 });
  forEach(createEnemies(level), (enemy) => drawEnemy(context, enemy, 0));
  forEach(grid, (cells, row) =>
    forEach(cells, (cell, column) => {
      if (cell === STRUCTURE_START || cell === STRUCTURE_END)
        drawMarker(context, cell, row, column);
    }),
  );
};
