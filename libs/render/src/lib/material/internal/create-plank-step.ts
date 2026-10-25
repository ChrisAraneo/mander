import { TILE_SIZE } from '@mander/model';
import { size } from 'lodash-es';
import { pipe } from 'remeda';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { PLANK_HEIGHT } from './consts';
import { getWoodPlankTones } from './get-wood-plank-tones';

const PLANK_TOP = 'RGBA(255, 255, 255, 0.18)';

const PLANK_BOTTOM = 'RGBA(0, 0, 0, 0.20)';

const GRAIN_DARK = 'RGBA(0, 0, 0, 0.18)';

const GRAIN_LIGHT = 'RGBA(255, 255, 255, 0.14)';

const BUTT_INSET = 3;

const BUTT_SPREAD = 24;

export const createPlankStep = (
  pixelX: number,
  top: number,
  seed: number,
  style: MaterialStyle,
): CanvasStep =>
  pipe(
    style.base,
    getWoodPlankTones,
    (tones) => ({
      tone: tones[seed % size(tones)],
      buttX: BUTT_INSET + (seed % BUTT_SPREAD),
    }),
    ({ tone, buttX }) =>
      createSequenceStep([
        createStyleStep({ fillStyle: tone }),
        createFillRectStep(pixelX, top, TILE_SIZE, PLANK_HEIGHT),
        createStyleStep({ fillStyle: PLANK_TOP }),
        createFillRectStep(pixelX, top + 1, TILE_SIZE, 2),
        createStyleStep({ fillStyle: PLANK_BOTTOM }),
        createFillRectStep(pixelX, top + PLANK_HEIGHT - 3, TILE_SIZE, 2),
        createStyleStep({ fillStyle: GRAIN_DARK }),
        createFillRectStep(
          pixelX + (seed % 5),
          top + 3 + (seed % 3),
          TILE_SIZE - 6,
          1,
        ),
        createFillRectStep(
          pixelX + 6 + (seed % 7),
          top + PLANK_HEIGHT - 5,
          TILE_SIZE - 10,
          1,
        ),
        createStyleStep({ fillStyle: GRAIN_LIGHT }),
        createFillRectStep(pixelX + 2 + (seed % 9), top + 5, TILE_SIZE - 14, 1),
        createStyleStep({ fillStyle: style.joint }),
        createFillRectStep(pixelX, top + PLANK_HEIGHT - 1, TILE_SIZE, 1),
        createFillRectStep(pixelX + buttX, top, 1, PLANK_HEIGHT - 1),
        createStyleStep({ fillStyle: GRAIN_LIGHT }),
        createFillRectStep(pixelX + buttX + 1, top, 1, PLANK_HEIGHT - 1),
      ]),
  );
