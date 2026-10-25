import { type Rectangle } from '@mander/model';
import { pipe } from 'remeda';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import type { CanvasStep } from '../types/canvas-step';
import { createKeyGlyphStep } from './internal/create-key-glyph-step';

const KEY_BOB_SPEED = 3;

const KEY_BOB_HEIGHT = 3;

export const createKeyStep = (key: Rectangle, time: number): CanvasStep =>
  pipe(
    Math.sin(time * KEY_BOB_SPEED) * KEY_BOB_HEIGHT,
    (bob) => ({
      centerX: key.x + key.width / 2,
      centerY: key.y + key.height / 2 + bob,
    }),
    ({ centerX, centerY }) =>
      createSequenceStep([
        drawSave,
        createKeyGlyphStep(centerX, centerY),
        drawRestore,
      ]),
  );
