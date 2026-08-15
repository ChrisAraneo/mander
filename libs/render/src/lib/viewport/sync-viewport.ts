import { assign, chain, round } from 'lodash-es';
import { match } from 'ts-pattern';

import { VIEW_HEIGHT, VIEW_WIDTH } from './consts';
import { wholeTileScale } from './whole-tile-scale';
import type { Viewport } from './viewport';

type CanvasSize = Partial<Pick<HTMLCanvasElement, 'width' | 'height'>>;

const widthChange = (
  canvas: HTMLCanvasElement,
  deviceWidth: number,
): CanvasSize =>
  match(canvas.width !== deviceWidth)
    .with(true, (): CanvasSize => ({ width: deviceWidth }))
    .otherwise((): CanvasSize => ({}));

const heightChange = (
  canvas: HTMLCanvasElement,
  deviceHeight: number,
): CanvasSize =>
  match(canvas.height !== deviceHeight)
    .with(true, (): CanvasSize => ({ height: deviceHeight }))
    .otherwise((): CanvasSize => ({}));

const resizeToDisplay = (
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  pixelRatio: number,
): HTMLCanvasElement =>
  chain({
    deviceWidth: round(cssWidth * pixelRatio),
    deviceHeight: round(cssHeight * pixelRatio),
  })
    .thru(({ deviceWidth, deviceHeight }): CanvasSize =>
      assign(
        {},
        widthChange(canvas, deviceWidth),
        heightChange(canvas, deviceHeight),
      ),
    )
    .thru((size) => assign(canvas, size))
    .value();

export const syncViewport = (canvas: HTMLCanvasElement): Viewport =>
  chain({
    pixelRatio: window.devicePixelRatio || 1,
    cssWidth: Math.max(1, canvas.clientWidth),
    cssHeight: Math.max(1, canvas.clientHeight),
  })
    .thru(({ pixelRatio, cssWidth, cssHeight }) => ({
      pixelRatio,
      cssWidth,
      cssHeight,
      resized: resizeToDisplay(canvas, cssWidth, cssHeight, pixelRatio),
    }))
    .thru(({ pixelRatio, cssWidth, cssHeight, resized }) => ({
      resized,
      scale: wholeTileScale(
        Math.min(cssWidth / VIEW_WIDTH, cssHeight / VIEW_HEIGHT) * pixelRatio,
      ),
    }))
    .thru(({ resized, scale }) => ({
      width: resized.width / scale,
      height: resized.height / scale,
      scale,
    }))
    .value();
