import { type Rectangle, chain } from '@mander/utils';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawRestore } from '../../canvas/draw-restore';
import { drawSave } from '../../canvas/draw-save';
import type { CanvasStep } from '../../types/canvas-step';
import { createKeyGlyphStep } from './create-key-glyph-step';

const KEY_BOB_SPEED = 3;

const KEY_BOB_HEIGHT = 3;

export const createKeyStep = (key: Rectangle, time: number): CanvasStep =>
  chain(Math.sin(time * KEY_BOB_SPEED) * KEY_BOB_HEIGHT)
    .thru((bob) => ({
      centerX: key.x + key.width / 2,
      centerY: key.y + key.height / 2 + bob,
    }))
    .thru(({ centerX, centerY }) =>
      createSequenceStep([
        drawSave,
        createKeyGlyphStep(centerX, centerY),
        drawRestore,
      ]),
    )
    .value();
