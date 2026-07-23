import {
  type Level,
  TILE_SIZE,
  TILE_SOLID,
  TILE_SPIKE,
} from '@mander/generator';
import { ceil, floor } from 'lodash-es';

import { VIEW_HEIGHT, VIEW_WIDTH } from './constants';
import { drawSpike } from './draw-spike';
import { solidAt } from './solid-at';

const drawSolidTile = (
  context: CanvasRenderingContext2D,
  level: Level,
  column: number,
  row: number,
): void => {
  const pixelX = column * TILE_SIZE;
  const pixelY = row * TILE_SIZE;
  context.fillStyle = '#5b4634';
  context.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
  context.fillStyle = 'rgba(0, 0, 0, 0.14)';
  context.fillRect(pixelX, pixelY + TILE_SIZE - 3, TILE_SIZE, 3);
  context.fillRect(pixelX + TILE_SIZE - 2, pixelY, 2, TILE_SIZE);

  if (!solidAt(level, column, row - 1)) {
    context.fillStyle = '#6faf58';
    context.fillRect(pixelX, pixelY, TILE_SIZE, 7);
    context.fillStyle = '#82c268';
    context.fillRect(pixelX, pixelY, TILE_SIZE, 3);
  }
};

export const drawTiles = (
  context: CanvasRenderingContext2D,
  level: Level,
  cameraX: number,
  cameraY: number,
): void => {
  const firstColumn = Math.max(0, floor(cameraX / TILE_SIZE) - 1);
  const lastColumn = Math.min(
    level.width - 1,
    ceil((cameraX + VIEW_WIDTH) / TILE_SIZE) + 1,
  );
  const firstRow = Math.max(0, floor(cameraY / TILE_SIZE) - 1);
  const lastRow = Math.min(
    level.height - 1,
    ceil((cameraY + VIEW_HEIGHT) / TILE_SIZE) + 1,
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
