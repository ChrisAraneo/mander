import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { createCannons } from '../cannon/create-cannons';
import { createEnemies } from '../enemy/create-enemies';
import { createFireballs } from '../fireball/create-fireballs';
import { createPlayerFireballs } from '../fireball/create-player-fireballs';
import { createPlayer } from '../player/create-player';

export const respawn = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState =>
      chain(createPlayer(state.level, state.player))
        .thru((player): GameState => ({
          ...state,
          player,
          enemies: createEnemies(state.level),
          cannons: createCannons(state.level),
          cannonballs: [],
          fireballs: createFireballs(state.level),
          playerFireballs: createPlayerFireballs(state.inventory, player),
          bullets: [],
        }))
        .value(),
    )
    .otherwise((): GameState => state);
