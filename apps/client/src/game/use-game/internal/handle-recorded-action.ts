import {
  type Action,
  addRecordedAction,
  type RecorderState,
} from '@mander/engine';
import { noop, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { patchRef } from '../../canvas';
import type { Game } from '../types/game';
import { startNewRun } from './start-new-run';

export const handleRecordedAction = (
  game: Game,
  action: Action,
): RecorderState =>
  pipe(
    action,
    (current) =>
      tap(current, () =>
        match(current.type)
          .with('RESTART', () => startNewRun(game))
          .otherwise(noop),
      ),
    (current) =>
      patchRef(game.recorder, addRecordedAction(game.recorder.value, current)),
  );
