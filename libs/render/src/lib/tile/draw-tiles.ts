import {
  isSolidTile,
  isSpikeTile,
  type Level,
  TILE_CANNON,
  TILE_SIZE,
} from '@mander/model';
import { ceil, chain, flatMap, floor, map, range } from 'lodash-es';
import { match } from 'ts-pattern';

import {
  type CanvasStep,
  fillRect,
  paint,
  sequence,
  skip,
  styled,
  when,
} from '../canvas';
import {
  type MaterialPalette,
  materialPalette,
  materialStep,
  type MaterialStyle,
} from '../material';
import type { Palette } from '../palette';
import { spikeStep } from '../spike';
import type { Viewport } from '../viewport';
import { solidAt } from './solid-at';
import { tileEdgesStep } from './tile-edges-step';

const solidTileStep = (
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
        styled({ fillStyle: style.base }),
        fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
        materialStep(tile, pixelX, pixelY, style),
        when(
          !solidAt(level, column, row - 1),
          styled({ fillStyle: style.cap }),
          fillRect(pixelX, pixelY, TILE_SIZE, 7),
          styled({ fillStyle: style.capHighlight }),
          fillRect(pixelX, pixelY, TILE_SIZE, 3),
        ),
        tileEdgesStep(level, column, row),
      ]),
    )
    .value();

const tileStep = (
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
        .with({ isSpike: true }, () => spikeStep(level, column, row))
        .with({ isSolid: true }, () =>
          solidTileStep(level, column, row, materials(tile)),
        )
        .otherwise(() => skip),
    )
    .value();

const visibleRange = (
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
    materials: materialPalette(palette),
    columns: visibleRange(cameraX, viewport.width, level.width - 1),
    rows: visibleRange(cameraY, viewport.height, level.height - 1),
  })
    .thru(({ materials, columns, rows }) =>
      flatMap(columns, (column) =>
        map(rows, (row) => tileStep(level, column, row, materials)),
      ),
    )
    .thru((steps) => paint(context, ...steps))
    .value();
