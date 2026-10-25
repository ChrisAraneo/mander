import type { GameState } from '@mander/engine';
import { match } from 'ts-pattern';
import type { RunOutcome } from '../../storage';

export const toRunOutcome = (state: GameState): RunOutcome =>
  match(state.status)
    .with('GAME_OVER', (): RunOutcome => 'GAME_OVER')
    .otherwise((): RunOutcome => 'COMPLETE');
