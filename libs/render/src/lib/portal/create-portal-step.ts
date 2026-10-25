import type { GameState } from '@mander/engine';
import { type Rectangle } from '@mander/model';
import type { CanvasStep } from '../types/canvas-step';
import { createPortalPulseStep } from './internal/create-portal-pulse-step';

const PULSE_SPEED = 3;

const PULSE_DEPTH = 0.05;

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
