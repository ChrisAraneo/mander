import { findDiamondTiles } from '@mander/model';

import type { GameState } from '../../state/types/game-state';
import { createEnemies } from '../enemy/create-enemies';
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
  diamonds: findDiamondTiles(level),
  status: 'PLAYING',
  hasKey: false,
  isChestOpened: false,
  isNearChest: false,
  isNearPortal: false,
  time: 0,
});
