import { computeInterpolatedState } from '@mander/render';
import { drawCanvasGame } from '../../canvas';
import type { Pulse } from '../../tick';
import type { Backdrop } from '../types/backdrop';

export const drawBackdropPulse = (backdrop: Backdrop, pulse: Pulse): void =>
  drawCanvasGame(
    backdrop.cell,
    computeInterpolatedState(
      backdrop.frame.value.previous,
      backdrop.frame.value.current,
      pulse.alpha,
    ),
    backdrop.palette,
    backdrop.focus,
    [],
  );
