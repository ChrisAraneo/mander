import { chain } from '@mander/utils';
import { assign, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Ref } from 'vue';

const { nonNullable } = P;

export interface CanvasCell {
  context: CanvasRenderingContext2D | null;
}

export const createCanvasCell = (): CanvasCell => ({
  context: null,
});

export const openCanvas = (
  cell: CanvasCell,
  canvas: Ref<HTMLCanvasElement | null>,
): CanvasRenderingContext2D | null =>
  chain(canvas.value)
    .thru((element) =>
      match(element)
        .with(nonNullable, (mounted) =>
          mounted.getContext('2d', { alpha: false }),
        )
        .otherwise(() => null),
    )
    .thru((context) => assign(cell, { context }))
    .thru((current) => current.context)
    .value();

export const drawWithCanvas = (
  cell: CanvasCell,
  canvas: Ref<HTMLCanvasElement | null>,
  draw: (context: CanvasRenderingContext2D, element: HTMLCanvasElement) => void,
): void =>
  match({ element: canvas.value, context: cell.context })
    .with(
      { element: nonNullable, context: nonNullable },
      ({ element, context }) => draw(context, element),
    )
    .otherwise(noop);

export const closeCanvas = (cell: CanvasCell): void =>
  void assign(cell, { context: null });
