import { createEnemies, TILE_SIZE } from '@mander/engine';
import type { Structure } from '@mander/structures';
import { drawEnemy, drawTiles } from '@mander/render';
import { forEach } from 'lodash-es';

import { previewLevel } from './preview-level';

/**
 * Paints a structure with the client's own renderer, so the editor shows the
 * exact tiles, grass caps, material textures and spikes the game will draw for
 * these cells — there is no second set of colours here to drift out of step.
 *
 * Enemies are drawn still: `createEnemies` leaves them ungrounded, so the idle
 * wobble that reads off the clock stays at rest whatever time is passed.
 */
export const drawStructure = (
  context: CanvasRenderingContext2D,
  grid: Structure,
): void => {
  const level = previewLevel(grid);
  const width = level.width * TILE_SIZE;
  const height = level.height * TILE_SIZE;

  context.clearRect(0, 0, width, height);
  drawTiles(context, level, 0, 0, { width, height, scale: 1 });
  forEach(createEnemies(level), (enemy) => drawEnemy(context, enemy, 0));
};
