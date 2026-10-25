import { assign, round, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';

const { nullish } = P;

export const patchCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  devicePixelRatio: number,
): CanvasRenderingContext2D | null =>
  pipe(
    canvas,
    (target) =>
      assign(target, {
        width: round(width * devicePixelRatio),
        height: round(height * devicePixelRatio),
      }),
    (target) =>
      tap(target, () =>
        assign(target.style, {
          width: `${width}px`,
          height: `${height}px`,
        }),
      ),
    (target) => target.getContext('2d'),
    (context) =>
      match(context)
        .with(nullish, () => null)
        .otherwise((ready) =>
          tap(ready, () =>
            ready.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0),
          ),
        ),
  );
