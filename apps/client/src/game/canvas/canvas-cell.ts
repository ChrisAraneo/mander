import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Ref } from 'vue';

const { nonNullable } = P;

/**
 * The 2D context a composable resolves on mount and holds for its lifetime.
 * One mutable field, so the composables around it stay pipelines.
 */
export interface CanvasCell {
  context: CanvasRenderingContext2D | null;
}

export const createCanvasCell = (): CanvasCell => ({ context: null });

/** Resolves the context off the now-mounted element and stores it. */
export const openCanvas = (
  cell: CanvasCell,
  canvas: Ref<HTMLCanvasElement | null>,
): CanvasRenderingContext2D | null =>
  Object.assign(cell, {
    context: canvas.value?.getContext('2d') ?? null,
  }).context;

/** Runs `draw` only once both the element and its context are there. */
export const withCanvas = (
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
