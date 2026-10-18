import {
  type Level,
  isSpikeTile,
  isSolidTile,
  TILE_CANNON,
} from '@mander/model';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';
import { drawNothing } from '../../canvas/draw-nothing';
import { createSpikeStep } from '../../spike/create-spike-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialPalette } from '../../types/material-palette';
import { createSolidTileStep } from './create-solid-tile-step';

export const createFrontLayerTileStep = (
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
        .with({ isCannon: true }, () => drawNothing)
        .with({ isSpike: true }, () => createSpikeStep(level, column, row))
        .with({ isSolid: true }, () =>
          createSolidTileStep(level, column, row, materials(tile)),
        )
        .otherwise(() => drawNothing),
    )
    .value();
