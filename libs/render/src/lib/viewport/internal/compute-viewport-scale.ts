import { computeWholeTileScale } from '../compute-whole-tile-scale';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../consts';

export const computeViewportScale = (
  canvas: HTMLCanvasElement,
  pixelRatio: number,
): number =>
  computeWholeTileScale(
    Math.min(
      Math.max(1, canvas.clientWidth) / VIEW_WIDTH,
      Math.max(1, canvas.clientHeight) / VIEW_HEIGHT,
    ) * pixelRatio,
  );
