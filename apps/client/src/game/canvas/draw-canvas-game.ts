import type { GameState } from '@mander/engine';
import {
  drawGame,
  type Focus,
  type Ghost,
  type Palette,
  patchViewport,
} from '@mander/render';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { CanvasCell } from './types/canvas-cell';

const { nonNullable } = P;

export const drawCanvasGame = (
  cell: CanvasCell,
  state: GameState,
  palette: Palette,
  focus: Focus,
  ghosts: Ghost[],
): void =>
  match({ element: cell.canvas.value, context: cell.context.value })
    .with(
      { element: nonNullable, context: nonNullable },
      ({ element, context }) =>
        drawGame(
          context,
          state,
          palette,
          patchViewport(element),
          focus,
          ghosts,
        ),
    )
    .otherwise(noop);
