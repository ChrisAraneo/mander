import { chain } from '@mander/utils';
import {
  getBackTileAt,
  isSolidTile,
  isSpikeTile,
  type Level,
  TILE_CANNON,
  TILE_SIZE,
} from '@mander/model';
import { ceil, flatMap, floor, map, range } from 'lodash-es';
import { match } from 'ts-pattern';

import {
  applyStyle,
  type CanvasStep,
  fillRect,
  paint,
  runWhen,
  sequence,
  skip,
} from '../canvas';
import {
  createMaterialPalette,
  createMaterialStep,
  type MaterialPalette,
  type MaterialStyle,
} from '../material';
import type { Palette } from '../palette';
import { createSpikeStep } from '../spike';
import type { Viewport } from '../viewport';
import { createBackTileStep } from './create-back-tile-step';
import { isSolidAt } from './is-solid-at';
import { createTileEdgesStep } from './create-tile-edges-step';

const createSolidTileStep = (
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): CanvasStep =>
  chain({ pixelX: column * TILE_SIZE, pixelY: row * TILE_SIZE })
    .thru(({ pixelX, pixelY }) => ({
      pixelX,
      pixelY,
      tile: level.tiles[row][column],
    }))
    .thru(({ pixelX, pixelY, tile }) =>
      sequence([
        applyStyle({ fillStyle: style.base }),
        fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
        createMaterialStep(tile, pixelX, pixelY, style),
        runWhen(
          !isSolidAt(level, column, row - 1),
          applyStyle({ fillStyle: style.cap }),
          fillRect(pixelX, pixelY, TILE_SIZE, 7),
          applyStyle({ fillStyle: style.capHighlight }),
          fillRect(pixelX, pixelY, TILE_SIZE, 3),
        ),
        createTileEdgesStep(level, column, row),
      ]),
    )
    .value();

const createTileStep = (
  level: Level,
  column: number,
  row: number,
  materials: MaterialPalette,
): CanvasStep =>
  chain(level.tiles[row][column])
    .thru((tile) => ({
      tile,
      isSpike: isSpikeTile(tile),
      isSolid: isSolidTile(tile),
      isCannon: tile === TILE_CANNON,
    }))
    .thru(({ tile, isSpike, isSolid, isCannon }) =>
      match({ isSpike, isSolid, isCannon })
        .with({ isCannon: true }, () => skip)
        .with({ isSpike: true }, () => createSpikeStep(level, column, row))
        .with({ isSolid: true }, () =>
          createSolidTileStep(level, column, row, materials(tile)),
        )
        .otherwise(() => skip),
    )
    .value();

const createBackStep = (
  level: Level,
  column: number,
  row: number,
  materials: MaterialPalette,
): CanvasStep =>
  chain(getBackTileAt(level, column, row))
    .thru((tile) =>
      match(isSolidTile(tile))
        .with(true, () =>
          createBackTileStep(level, column, row, materials(tile)),
        )
        .otherwise(() => skip),
    )
    .value();

const getVisibleRange = (
  camera: number,
  view: number,
  lastIndex: number,
): number[] =>
  range(
    Math.max(0, floor(camera / TILE_SIZE) - 1),
    Math.min(lastIndex, ceil((camera + view) / TILE_SIZE) + 1) + 1,
  );

export const drawTiles = (
  context: CanvasRenderingContext2D,
  level: Level,
  palette: Palette,
  cameraX: number,
  cameraY: number,
  viewport: Viewport,
): void =>
  chain({
    materials: createMaterialPalette(palette),
    columns: getVisibleRange(cameraX, viewport.width, level.width - 1),
    rows: getVisibleRange(cameraY, viewport.height, level.height - 1),
  })
    .thru(({ materials, columns, rows }) => [
      // the back layer is laid down whole before the front, so nothing the
      // player can touch is painted over by what stands behind it
      ...flatMap(columns, (column) =>
        map(rows, (row) => createBackStep(level, column, row, materials)),
      ),
      ...flatMap(columns, (column) =>
        map(rows, (row) => createTileStep(level, column, row, materials)),
      ),
    ])
    .thru((steps) => paint(context, ...steps))
    .value();
