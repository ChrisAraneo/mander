import { type GameState, serializeReplay, toReplay } from '@mander/engine';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { RunOutcome } from '../../storage';
import type { Game } from '../types/game';
import { computeRunSeconds } from './compute-run-seconds';
import { createFinishedRun } from './create-finished-run';
import { shouldWriteRun } from './should-write-run';
import { writeFinishedRun } from './write-finished-run';

export const writeGameRun = (
  game: Game,
  state: GameState,
  outcome: RunOutcome,
): boolean =>
  pipe(
    computeRunSeconds(state),
    (seconds) => ({
      seconds,
      isWriting: shouldWriteRun(game.isRunSaved.value, outcome, seconds),
    }),
    ({ seconds, isWriting }) =>
      match(isWriting)
        .with(true, () =>
          writeFinishedRun(
            game,
            createFinishedRun(
              state,
              outcome,
              seconds,
              game.world.name,
              game.day,
              serializeReplay(toReplay(game.recorder.value)),
            ),
          ),
        )
        .otherwise(() => false),
  );
