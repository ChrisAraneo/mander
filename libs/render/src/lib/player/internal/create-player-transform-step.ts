import { PLAYER_WIDTH } from '@mander/engine';
import type { Point } from '@mander/model';
import { createRotateStep } from '../../canvas/create-rotate-step';
import { createScaleStep } from '../../canvas/create-scale-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createTranslateStep } from '../../canvas/create-translate-step';
import type { CanvasStep } from '../../types/canvas-step';
import { HALF_HEIGHT } from './consts';

const HALF_WIDTH = PLAYER_WIDTH / 2;

const DEATH_SPIN = Math.PI * 0.9;

export const createPlayerTransformStep = (
  position: Point,
  facing: number,
  progress: number,
): CanvasStep =>
  createSequenceStep([
    createTranslateStep(position.x + HALF_WIDTH, position.y + HALF_HEIGHT),
    createRotateStep(-facing * progress * DEATH_SPIN),
    createScaleStep(facing, 1),
  ]);
