import {
  isSolidTile,
  type Level,
  materialStyle,
  TILE_SIZE,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/engine';
import { ceil, floor, forEach, range } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { drawMaterial } from './draw-material';
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
  const tile = level.tiles[row][column];
  const style = materialStyle(tile);

  context.fillStyle = style.base;
  context.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
  drawMaterial(context, tile, pixelX, pixelY);
  context.fillStyle = 'RGBA(0, 0, 0, 0.14)';
  context.fillRect(pixelX, pixelY + TILE_SIZE - 3, TILE_SIZE, 3);
  context.fillRect(pixelX + TILE_SIZE - 2, pixelY, 2, TILE_SIZE);

  match(solidAt(level, column, row - 1))
    .with(false, () => {
      context.fillStyle = style.cap;
      context.fillRect(pixelX, pixelY, TILE_SIZE, 7);
      context.fillStyle = style.capHighlight;
      context.fillRect(pixelX, pixelY, TILE_SIZE, 3);
    })
    .otherwise(() => undefined);
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

  forEach(range(firstColumn, lastColumn + 1), (column) =>
    forEach(range(firstRow, lastRow + 1), (row) =>
      match(level.tiles[row][column])
        .with(
          P.when((tile) => tile === TILE_SPIKE),
          () => drawSpike(context, column, row, 'FLOOR'),
        )
        .with(
          P.when((tile) => tile === TILE_SPIKE_CEILING),
          () => drawSpike(context, column, row, 'CEILING'),
        )
        .with(
          P.when((tile) => isSolidTile(tile)),
          () => drawSolidTile(context, level, column, row),
        )
        .otherwise(() => undefined),
    ),
  );
};
