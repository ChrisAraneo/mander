import { VIEW_HEIGHT, VIEW_WIDTH } from './consts';
import { wholeTileScale } from './whole-tile-scale';

export const viewportScale = (canvas: HTMLCanvasElement): number =>
  wholeTileScale(
    Math.min(
      Math.max(1, canvas.clientWidth) / VIEW_WIDTH,
      Math.max(1, canvas.clientHeight) / VIEW_HEIGHT,
    ) * (window.devicePixelRatio || 1),
  );
