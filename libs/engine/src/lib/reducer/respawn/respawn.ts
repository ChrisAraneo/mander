import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { createCannons } from '../cannon/create-cannons';
import { createEnemies } from '../enemy/create-enemies';
import { createPlayer } from '../player/create-player';

export const respawn = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState => ({
      ...state,
      player: createPlayer(state.level, state.player),
      enemies: createEnemies(state.level),
      cannons: createCannons(state.level),
      cannonballs: [],
    }))
    .otherwise((): GameState => state);
