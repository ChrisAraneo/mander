import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { createEnemies } from '../enemy/create-enemies';
import { createPlayer } from '../player/create-player';

export const respawn = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState => ({
      ...state,
      player: createPlayer(state.level, state.player),
      enemies: createEnemies(state.level),
    }))
    .otherwise((): GameState => state);
