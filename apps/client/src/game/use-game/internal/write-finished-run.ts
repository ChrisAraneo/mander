import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { patchRef } from '../../canvas';
import { type FinishedRun, writeRun } from '../../storage';
import type { Game } from '../types/game';

export const writeFinishedRun = (game: Game, run: FinishedRun): boolean =>
  pipe(
    run,
    (finished) => tap(finished, () => patchRef(game.isRunSaved, true)),
    (finished) =>
      writeRun(finished, new Date().toISOString(), Math.random, game.storage),
  );
