import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { createOrbTileStep } from './create-orb-tile-step';

const FROST_VEIN = '#4FE3F2';

const FROST_CORE = '#EDFEFF';

export const createIceballTileStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  createOrbTileStep(pixelX, pixelY, style, FROST_VEIN, FROST_CORE);
