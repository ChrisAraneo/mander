import {
  type Level,
  TILE_SIZE,
  TILE_SOLID,
  TILE_SPIKE,
} from '@mander/generator';
import { ceil, floor } from 'lodash-es';

import { drawSpike } from './draw-spike';
import { solidAt } from './solid-at';
import type { Viewport } from './viewport';

const drawSolidTile = (
  context: CanvasRenderingContext2D,
  level: Level,
  column: number,
  row: number,
): void => {
  const pixelX = column * TILE_SIZE;
  const pixelY = row * TILE_SIZE;
  context.fillStyle = level.palette.block;
  context.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
  context.fillStyle = 'RGBA(0, 0, 0, 0.14)';
  context.fillRect(pixelX, pixelY + TILE_SIZE - 3, TILE_SIZE, 3);
  context.fillRect(pixelX + TILE_SIZE - 2, pixelY, 2, TILE_SIZE);

  if (!solidAt(level, column, row - 1)) {
    context.fillStyle = level.palette.blockCap;
    context.fillRect(pixelX, pixelY, TILE_SIZE, 7);
    context.fillStyle = level.palette.blockCapHighlight;
    context.fillRect(pixelX, pixelY, TILE_SIZE, 3);
  }
};

export const drawTiles = (
  context: CanvasRenderingContext2D,
  level: Level,
  cameraX: number,
  cameraY: number,
  viewport: Viewport,
): void => {
  const firstColumn = Math.max(0, floor(cameraX / TILE_SIZE) - 1);
  const lastColumn = Math.min(
    level.width - 1,
    ceil((cameraX + viewport.width) / TILE_SIZE) + 1,
  );
  const firstRow = Math.max(0, floor(cameraY / TILE_SIZE) - 1);
  const lastRow = Math.min(
    level.height - 1,
    ceil((cameraY + viewport.height) / TILE_SIZE) + 1,
  );

  for (let column = firstColumn; column <= lastColumn; column++) {
    for (let row = firstRow; row <= lastRow; row++) {
      const tile = level.tiles[row][column];
      if (tile === TILE_SPIKE) {
        drawSpike(context, column, row);
      } else if (tile === TILE_SOLID) {
        drawSolidTile(context, level, column, row);
      }
    }
  }
};
