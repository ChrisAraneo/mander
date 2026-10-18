import type { GameState } from '@mander/engine';
import type { Rectangle } from '@mander/model';
import { match } from 'ts-pattern';
import { createFillRectStep } from '../canvas/create-fill-rect-step';
import { createRectStep } from '../canvas/create-rect-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawBeginPath } from '../canvas/draw-begin-path';
import { drawFill } from '../canvas/draw-fill';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { outline } from '../stroke/outline';
import type { CanvasStep } from '../types/canvas-step';
import { createChestLidStep } from './internal/create-chest-lid-step';

const BODY_OPEN = '#7A5A30';

const BODY_CLOSED = '#A97B34';

const SHADOW = 'RGBA(0, 0, 0, 0.25)';

export const createChestStep = (
  chest: Rectangle,
  state: GameState,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    drawBeginPath,
    createRectStep(chest.x, chest.y + 6, chest.width, chest.height - 6),
    outline(),
    createStyleStep({
      fillStyle: match(state.isChestOpened)
        .with(true, () => BODY_OPEN)
        .otherwise(() => BODY_CLOSED),
    }),
    drawFill,
    createChestLidStep(chest, state.isChestOpened),
    createStyleStep({ fillStyle: SHADOW }),
    createFillRectStep(chest.x + 3, chest.y + 6, 2, chest.height - 6),
    createFillRectStep(
      chest.x + chest.width - 5,
      chest.y + 6,
      2,
      chest.height - 6,
    ),
    drawRestore,
  ]);
