import type { Action } from '@mander/engine';
import { assign } from 'lodash-es';
import { addGameAction } from '../add-game-action';
import type { Game } from '../types/game';

export const writeDebugGlobals = (game: Game, target: Window): Window =>
  assign(target, {
    manderState: game.state.value,
    manderDispatch: (action: Action): void => addGameAction(game, action),
  });
