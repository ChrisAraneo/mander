import { finishRecording, type GameState } from '@mander/engine';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { patchRef } from '../../canvas';
import type { Game } from '../types/game';
import { isRunOver } from './is-run-over';
import { toRunOutcome } from './to-run-outcome';
import { writeGameRun } from './write-game-run';

export const finishRun = (game: Game, next: GameState): boolean =>
  match(isRunOver(game.world, next))
    .with(true, () =>
      pipe(
        game,
        (current) =>
          tap(current, () =>
            patchRef(current.recorder, finishRecording(current.recorder.value)),
          ),
        (current) => writeGameRun(current, next, toRunOutcome(next)),
      ),
    )
    .otherwise(() => false);
