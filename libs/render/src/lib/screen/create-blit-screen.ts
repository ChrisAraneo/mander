import { chain, withEffect } from '@mander/utils';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { deviceSize, resizeCanvas } from '../viewport';
import type { Screen } from './screen';

const { nullish } = P;

/**
 * What a machine without WebGL2 gets: the frame straight through, no effect.
 * The game stays playable, it just does not go through the tape.
 */
const blit = (
  display: CanvasRenderingContext2D,
  buffer: CanvasRenderingContext2D,
): Screen => ({
  buffer,
  fit: () =>
    void chain(deviceSize(display.canvas))
      .thru((size) =>
        withEffect(size, () => resizeCanvas(display.canvas, size)),
      )
      .thru((size) => resizeCanvas(buffer.canvas, size))
      .value(),
  present: () => display.drawImage(buffer.canvas, 0, 0),
  dispose: noop,
});

export const createBlitScreen = (
  display: HTMLCanvasElement,
  buffer: CanvasRenderingContext2D,
): Screen | null =>
  match(display.getContext('2d'))
    .with(nullish, () => null)
    .otherwise((context) => blit(context, buffer));
