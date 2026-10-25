import type { Action } from '@mander/engine';
import type { Game } from './types/game';

export const addGameAction = (game: Game, action: Action): void =>
  game.actions.next(action);
