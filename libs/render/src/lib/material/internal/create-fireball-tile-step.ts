import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { createOrbTileStep } from './create-orb-tile-step';

const EMBER_VEIN = '#FF7A2F';

const EMBER_CORE = '#FFD166';

export const createFireballTileStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  createOrbTileStep(pixelX, pixelY, style, EMBER_VEIN, EMBER_CORE);
