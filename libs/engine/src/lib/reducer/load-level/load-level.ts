import { findDiamondTiles } from '@mander/model';

import type { GameState } from '../../state/types/game-state';
import { createCannons } from '../cannon/create-cannons';
import { createEnemies } from '../enemy/create-enemies';
import { createFireballs } from '../fireball/create-fireballs';
import { createPlayer } from '../player/create-player';

export const loadLevel = (
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
  fireballs: createFireballs(level),
  diamonds: findDiamondTiles(level),
  status: 'PLAYING',
  hasKey: false,
  isChestOpened: false,
  isNearChest: false,
  isNearPortal: false,
  time: 0,
});
