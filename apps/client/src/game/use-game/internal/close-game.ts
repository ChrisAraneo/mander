import { noop, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { closeCanvas } from '../../canvas';
import { closeKeyboard } from '../../input';
import type { Game } from '../types/game';
import { writeGameRun } from './write-game-run';

const { nonNullable } = P;

export const closeGame = (game: Game): CanvasRenderingContext2D | null =>
  pipe(
    game,
    (current) =>
      tap(current, () =>
        writeGameRun(current, current.state.value, 'ABANDONED'),
      ),
    (current) => tap(current, () => current.subscription.value?.unsubscribe()),
    (current) =>
      tap(current, () =>
        match(current.keyboard.value)
          .with(nonNullable, closeKeyboard)
          .otherwise(noop),
      ),
    (current) => closeCanvas(current.replay.stage.cell),
  );
