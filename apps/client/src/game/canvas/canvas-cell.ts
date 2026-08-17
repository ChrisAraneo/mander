import { createScreen, type Screen } from '@mander/render';
import { chain, withEffect } from '@mander/utils';
import { assign, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Ref } from 'vue';

const { nonNullable } = P;

/**
 * The screen a composable resolves on mount and holds for its lifetime, plus
 * the 2D context it draws into — which belongs to the screen's offscreen
 * buffer, not to the element on the page. Two mutable fields, so the
 * composables around them stay pipelines.
 */
export interface CanvasCell {
  context: CanvasRenderingContext2D | null;
  screen: Screen | null;
}

export const createCanvasCell = (): CanvasCell => ({
  context: null,
  screen: null,
});

/** Binds the screen to the now-mounted element and stores it. */
export const openCanvas = (
  cell: CanvasCell,
  canvas: Ref<HTMLCanvasElement | null>,
): CanvasRenderingContext2D | null =>
  chain(canvas.value)
    .thru((element) =>
      match(element)
        .with(nonNullable, (mounted) => createScreen(mounted))
        .otherwise(() => null),
    )
    .thru((screen) => assign(cell, { screen, context: screen?.buffer ?? null }))
    .thru((current) => current.context)
    .value();

/**
 * Runs `draw` on the offscreen buffer once element, context and screen are all
 * there, then puts the finished frame through the screen.
 */
export const withCanvas = (
  cell: CanvasCell,
  canvas: Ref<HTMLCanvasElement | null>,
  draw: (context: CanvasRenderingContext2D, element: HTMLCanvasElement) => void,
): void =>
  match({ element: canvas.value, context: cell.context, screen: cell.screen })
    .with(
      { element: nonNullable, context: nonNullable, screen: nonNullable },
      ({ element, context, screen }) =>
        chain(screen)
          .thru((current) => withEffect(current, () => current.fit()))
          .thru((current) => withEffect(current, () => draw(context, element)))
          .thru((current) => current.present())
          .value(),
    )
    .otherwise(noop);

/** Hands the GPU resources back when the composable goes away. */
export const closeCanvas = (cell: CanvasCell): void =>
  void chain(cell.screen)
    .thru((screen) => withEffect(screen, () => screen?.dispose()))
    .thru(() => assign(cell, { screen: null, context: null }))
    .value();
