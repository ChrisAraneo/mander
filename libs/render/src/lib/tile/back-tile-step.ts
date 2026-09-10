import { backTileAt, type Level, TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';

import {
  type CanvasStep,
  fillRect,
  restore,
  save,
  sequence,
  styled,
  when,
} from '../canvas';
import {
  BACK_DETAIL_ALPHA,
  BACK_SHADE,
  materialStep,
  type MaterialStyle,
} from '../material';
import { coveredAt } from './covered-at';

const CAP_HEIGHT = 7;
const CAP_HIGHLIGHT_HEIGHT = 3;

export const backTileStep = (
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): CanvasStep =>
  chain({
    pixelX: column * TILE_SIZE,
    pixelY: row * TILE_SIZE,
    tile: backTileAt(level, column, row),
  })
    .thru(({ pixelX, pixelY, tile }) =>
      sequence([
        save,
        styled({ fillStyle: style.base }),
        fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
        styled({ globalAlpha: BACK_DETAIL_ALPHA }),
        materialStep(tile, pixelX, pixelY, style),
        when(
          !coveredAt(level, column, row - 1),
          styled({ fillStyle: style.cap }),
          fillRect(pixelX, pixelY, TILE_SIZE, CAP_HEIGHT),
          styled({ fillStyle: style.capHighlight }),
          fillRect(pixelX, pixelY, TILE_SIZE, CAP_HIGHLIGHT_HEIGHT),
        ),
        restore,
        // no edges: the border belongs to the blocks the player can touch
        styled({ fillStyle: BACK_SHADE }),
        fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
      ]),
    )
    .value();
