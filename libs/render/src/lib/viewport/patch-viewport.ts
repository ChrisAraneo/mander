import type { Viewport } from '../types/viewport';
import { patchCanvasViewport } from './internal/patch-canvas-viewport';

export const patchViewport = (canvas: HTMLCanvasElement): Viewport =>
  patchCanvasViewport(canvas, window.devicePixelRatio || 1);
