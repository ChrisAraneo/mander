import { VIEW_HEIGHT, VIEW_WIDTH } from './consts';
import { getWholeTileScale } from './get-whole-tile-scale';

export const getViewportScale = (canvas: HTMLCanvasElement): number =>
  getWholeTileScale(
    Math.min(
      Math.max(1, canvas.clientWidth) / VIEW_WIDTH,
      Math.max(1, canvas.clientHeight) / VIEW_HEIGHT,
    ) * (window.devicePixelRatio || 1),
  );
