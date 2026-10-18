import type { Rectangle } from '@mander/utils';
import { match } from 'ts-pattern';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createRectStep } from '../../canvas/create-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';

const LID_OPEN = '#8A683A';

const LID_CLOSED = '#C3913F';

const CAVITY = '#2C2418';

const LATCH = '#E8C15C';

export const createChestLidStep = (
  chest: Rectangle,
  isOpen: boolean,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    match(isOpen)
      .with(true, () =>
        createRectStep(chest.x - 2, chest.y - 6, chest.width + 4, 7),
      )
      .otherwise(() =>
        createRectStep(chest.x - 1, chest.y, chest.width + 2, 9),
      ),
    outline(),
    createStyleStep({
      fillStyle: match(isOpen)
        .with(true, () => LID_OPEN)
        .otherwise(() => LID_CLOSED),
    }),
    drawFill,
    match(isOpen)
      .with(true, () =>
        createSequenceStep([
          createStyleStep({ fillStyle: CAVITY }),
          createFillRectStep(chest.x + 2, chest.y + 6, chest.width - 4, 5),
        ]),
      )
      .otherwise(() =>
        createSequenceStep([
          createStyleStep({ fillStyle: LATCH }),
          createFillRectStep(chest.x + chest.width / 2 - 2, chest.y + 6, 4, 7),
        ]),
      ),
  ]);
