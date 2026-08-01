import { TILE_SIZE } from '@mander/engine';
import { round } from 'lodash-es';

/**
 * Tiles are filled edge to edge, so when a tile boundary falls halfway across a
 * device pixel both neighbours paint part of that pixel and neither covers it:
 * what is behind them shows through as a hairline. Holding the scale and the
 * camera on whole pixels puts every tile edge on a pixel edge, and the seams
 * have nowhere to open up.
 */

/** A world length rounded so it covers a whole number of device pixels. */
export const snapToDevicePixel = (world: number, scale: number): number =>
  round(world * scale) / scale;

/**
 * The scale, nudged until a tile spans a whole number of device pixels. The
 * nudge is under half a pixel per tile — a fraction of a percent of zoom.
 */
export const wholeTileScale = (scale: number): number =>
  Math.max(1, round(scale * TILE_SIZE)) / TILE_SIZE;
