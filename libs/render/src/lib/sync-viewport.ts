import { round } from 'lodash-es';
import { match } from 'ts-pattern';

import { VIEW_HEIGHT, VIEW_WIDTH } from './consts';
import { wholeTileScale } from './device-pixel';
import type { Viewport } from './viewport';

const resizeToDisplay = (
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  pixelRatio: number,
): void => {
  const deviceWidth = round(cssWidth * pixelRatio);
  const deviceHeight = round(cssHeight * pixelRatio);
  match(canvas.width !== deviceWidth)
    .with(true, () => {
      canvas.width = deviceWidth;
    })
    .otherwise(() => undefined);
  match(canvas.height !== deviceHeight)
    .with(true, () => {
      canvas.height = deviceHeight;
    })
    .otherwise(() => undefined);
};

export const syncViewport = (canvas: HTMLCanvasElement): Viewport => {
  const pixelRatio = window.devicePixelRatio || 1;
  const cssWidth = Math.max(1, canvas.clientWidth);
  const cssHeight = Math.max(1, canvas.clientHeight);
  resizeToDisplay(canvas, cssWidth, cssHeight, pixelRatio);

  const cssScale = Math.min(cssWidth / VIEW_WIDTH, cssHeight / VIEW_HEIGHT);
  const scale = wholeTileScale(cssScale * pixelRatio);
  return {
    width: canvas.width / scale,
    height: canvas.height / scale,
    scale,
  };
};
