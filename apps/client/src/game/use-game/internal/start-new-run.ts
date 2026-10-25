import { createRecorder } from '@mander/engine';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { patchRef } from '../../canvas';
import type { Game } from '../types/game';
import { writeGameRun } from './write-game-run';

export const startNewRun = (game: Game): boolean =>
  pipe(
    game,
    (current) =>
      tap(current, () =>
        writeGameRun(current, current.state.value, 'ABANDONED'),
      ),
    (current) =>
      tap(current, () =>
        patchRef(
          current.recorder,
          createRecorder(current.recorder.value.worldName),
        ),
      ),
    (current) => patchRef(current.isRunSaved, false),
  );
