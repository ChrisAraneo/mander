import {
  isSolidTile,
  isSpikeTile,
  type Level,
  TILE_SIZE,
} from '@mander/engine';
import { ceil, floor, forEach, range } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { drawMaterial } from './draw-material';
import { drawSpike } from './draw-spike';
import { type MaterialPalette, materialPalette } from './material-palette';
import type { MaterialStyle } from './material-style';
import { solidAt } from './solid-at';
import { strokeTileEdges } from './stroke-tile-edges';
import type { Viewport } from './viewport';

const drawSolidTile = (
  context: CanvasRenderingContext2D,
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): void => {
  const pixelX = column * TILE_SIZE;
  const pixelY = row * TILE_SIZE;
  const tile = level.tiles[row][column];

  context.fillStyle = style.base;
  context.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
  drawMaterial(context, tile, pixelX, pixelY, style);

  match(solidAt(level, column, row - 1))
    .with(false, () => {
      context.fillStyle = style.cap;
      context.fillRect(pixelX, pixelY, TILE_SIZE, 7);
      context.fillStyle = style.capHighlight;
      context.fillRect(pixelX, pixelY, TILE_SIZE, 3);
    })
    .otherwise(() => undefined);

  strokeTileEdges(context, level, column, row);
};

export const drawTiles = (
  context: CanvasRenderingContext2D,
  level: Level,
  cameraX: number,
  cameraY: number,
  viewport: Viewport,
): void => {
  const materials: MaterialPalette = materialPalette(level.palette);
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
          P.when((tile) => isSpikeTile(tile)),
          () => drawSpike(context, level, column, row),
        )
        .with(
          P.when((tile) => isSolidTile(tile)),
          (tile) => drawSolidTile(context, level, column, row, materials(tile)),
        )
        .otherwise(() => undefined),
    ),
  );
};
