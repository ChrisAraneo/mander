import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawFill } from '../../canvas/draw-fill';
import { drawStroke } from '../../canvas/draw-stroke';
import { createOutlineStep } from '../../stroke/create-outline-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createKeyBowPathStep } from './create-key-bow-path-step';
import { createKeyTeethPathStep } from './create-key-teeth-path-step';

const KEY_COLOR = '#FFD166';

const KEY_LINE = 3;

export const createKeyGlyphStep = (
  centerX: number,
  centerY: number,
): CanvasStep =>
  createSequenceStep([
    createKeyBowPathStep(centerX, centerY),
    createOutlineStep(KEY_LINE),
    createKeyTeethPathStep(centerX, centerY),
    createOutlineStep(),
    createStyleStep({ strokeStyle: KEY_COLOR, lineWidth: KEY_LINE }),
    createKeyBowPathStep(centerX, centerY),
    drawStroke,
    createStyleStep({ fillStyle: KEY_COLOR }),
    createKeyTeethPathStep(centerX, centerY),
    drawFill,
  ]);
