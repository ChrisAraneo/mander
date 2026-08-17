import { chain, withEffect } from '@mander/utils';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { createBlitScreen } from './create-blit-screen';
import { createGlScreen } from './create-gl-screen';
import type { Screen } from './screen';

const { nullish } = P;

/** The offscreen cel the game is painted on before the tape gets to it. */
const createBuffer = (): CanvasRenderingContext2D | null =>
  document.createElement('canvas').getContext('2d', { alpha: false });

/**
 * Asked on a throwaway canvas, because a canvas only ever hands out one kind
 * of context: once the display canvas has been asked for WebGL, the 2D
 * fallback is no longer available on it.
 */
const supportsWebgl2 = (): boolean =>
  chain(document.createElement('canvas').getContext('webgl2'))
    .thru((gl) =>
      withEffect(gl, () =>
        match(gl?.getExtension('WEBGL_lose_context'))
          .with(nullish, noop)
          .otherwise((extension) => extension.loseContext()),
      ),
    )
    .thru((gl) => gl !== null)
    .value();

const attachScreen = (
  display: HTMLCanvasElement,
  buffer: CanvasRenderingContext2D,
): Screen | null =>
  match(supportsWebgl2())
    .with(true, () => createGlScreen(display, buffer))
    .otherwise(() => createBlitScreen(display, buffer));

/**
 * Binds a screen to the canvas that is on the page. The shader screen is the
 * one we want; a plain blit is the fallback when WebGL2 is unavailable.
 */
export const createScreen = (display: HTMLCanvasElement): Screen | null =>
  match(createBuffer())
    .with(nullish, () => null)
    .otherwise((buffer) => attachScreen(display, buffer));
