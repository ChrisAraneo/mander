import type { GameState } from '../../../types/game-state';
import { createCannons } from '../../cannon/create-cannons';
import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { createFireballs } from '../../fireball/create-fireballs';
import { createPlayer } from '../../player/create-player';

export const patchRespawnedState = (state: GameState): GameState => ({
  ...state,
  player: createPlayer(state.level, state.player),
  enemies: createEnemies(state.level),
  cannons: createCannons(state.level),
  cannonballs: [],
  snowballs: [],
  fallingSpikes: createFallingSpikes(state.level),
  fireballs: createFireballs(state.level),
  bullets: [],
});
