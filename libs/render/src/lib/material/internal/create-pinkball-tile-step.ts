import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { createOrbTileStep } from './create-orb-tile-step';

const BLOSSOM_VEIN = '#FF72C4';

const BLOSSOM_CORE = '#FFF0F8';

export const createPinkballTileStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  createOrbTileStep(pixelX, pixelY, style, BLOSSOM_VEIN, BLOSSOM_CORE);
