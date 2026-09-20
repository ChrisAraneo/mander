import { getBackTileAt, type Level, TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';

import {
  applyStyle,
  type CanvasStep,
  fillRect,
  restore,
  runWhen,
  save,
  sequence,
} from '../canvas';
import {
  BACK_SHADE,
  createMaterialStep,
  type MaterialStyle,
} from '../material';
import { isCoveredAt } from './is-covered-at';

const CAP_HEIGHT = 7;
const CAP_HIGHLIGHT_HEIGHT = 3;

export const createBackTileStep = (
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): CanvasStep =>
  chain({
    pixelX: column * TILE_SIZE,
    pixelY: row * TILE_SIZE,
    tile: getBackTileAt(level, column, row),
  })
    .thru(({ pixelX, pixelY, tile }) =>
      sequence([
        save,
        applyStyle({ fillStyle: style.base }),
        fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
        createMaterialStep(tile, pixelX, pixelY, style),
        runWhen(
          !isCoveredAt(level, column, row - 1),
          applyStyle({ fillStyle: style.cap }),
          fillRect(pixelX, pixelY, TILE_SIZE, CAP_HEIGHT),
          applyStyle({ fillStyle: style.capHighlight }),
          fillRect(pixelX, pixelY, TILE_SIZE, CAP_HIGHLIGHT_HEIGHT),
        ),
        restore,
        // no edges: the border belongs to the blocks the player can touch
        applyStyle({ fillStyle: BACK_SHADE }),
        fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
      ]),
    )
    .value();
