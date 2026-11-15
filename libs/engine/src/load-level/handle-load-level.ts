import { findGemTiles } from '@mander/model';
import { createCannons } from '../cannon/create-cannons';
import { createEnemies } from '../enemy/create-enemies';
import { createFallingSpikes } from '../falling-spike/create-falling-spikes';
import { createFireballs } from '../fireball/create-fireballs';
import { createPlayer } from '../player/create-player';
import type { GameState } from '../state/types/game-state';

export const handleLoadLevel = (
  state: GameState,
  level: GameState['level'],
  levelIndex: number,
): GameState => ({
  ...state,
  level,
  levelIndex,
  player: createPlayer(level, state.player),
  enemies: createEnemies(level),
  cannons: createCannons(level),
  cannonballs: [],
  snowballs: [],
  fallingSpikes: createFallingSpikes(level),
  fireballs: createFireballs(level),
  bullets: [],
  gems: findGemTiles(level),
  status: 'PLAYING',
  hasKey: false,
  isChestOpened: false,
  isNearChest: false,
  isNearPortal: false,
  time: 0,
});
