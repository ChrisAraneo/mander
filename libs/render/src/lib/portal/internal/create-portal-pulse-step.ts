import { type Rectangle } from '@mander/model';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawRestore } from '../../canvas/draw-restore';
import { drawSave } from '../../canvas/draw-save';
import type { CanvasStep } from '../../types/canvas-step';
import { createPortalCoreStep } from './create-portal-core-step';
import { createPortalRingsStep } from './create-portal-rings-step';

export const createPortalPulseStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
  time: number,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createPortalCoreStep(portal, centerX, centerY, pulse),
    createPortalRingsStep(portal, centerX, centerY, pulse, time),
    drawRestore,
  ]);
