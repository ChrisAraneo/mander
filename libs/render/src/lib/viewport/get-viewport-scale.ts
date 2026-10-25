import { computeViewportScale } from './internal/compute-viewport-scale';

export const getViewportScale = (canvas: HTMLCanvasElement): number =>
  computeViewportScale(canvas, window.devicePixelRatio || 1);
