import type { GameState } from '@mander/engine';
import { type Rectangle } from '@mander/model';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import type { CanvasStep } from '../types/canvas-step';
import { createPortalCoreStep } from './internal/create-portal-core-step';
import { createPortalRingsStep } from './internal/create-portal-rings-step';

const PULSE_SPEED = 3;

const PULSE_DEPTH = 0.05;

const createPortalPulseStep = (
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

export const createPortalStep = (
  portal: Rectangle,
  state: GameState,
): CanvasStep =>
  createPortalPulseStep(
    portal,
    portal.x + portal.width / 2,
    portal.y + portal.height / 2,
    1 + Math.sin(state.time * PULSE_SPEED) * PULSE_DEPTH,
    state.time,
  );
