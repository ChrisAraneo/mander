import { chain, withEffect } from '@mander/utils';
import { assign, round } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { nullish } = P;

export const fitCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D | null =>
  chain(window.devicePixelRatio || 1)
    .thru((ratio) =>
      withEffect(ratio, () =>
        assign(canvas, {
          width: round(width * ratio),
          height: round(height * ratio),
        }),
      ),
    )
    .thru((ratio) =>
      withEffect(ratio, () =>
        assign(canvas.style, {
          width: `${width}px`,
          height: `${height}px`,
        }),
      ),
    )
    .thru((ratio) => ({ ratio, context: canvas.getContext('2d') }))
    .thru(({ ratio, context }) =>
      match(context)
        .with(nullish, () => null)
        .otherwise((ready) =>
          withEffect(ready, () => ready.setTransform(ratio, 0, 0, ratio, 0, 0)),
        ),
    )
    .value();
