import type { Item, Level } from '@mander/generator';

import { createEnemies } from './create-enemies';
import { createPlayer } from './create-player';
import type { GameState } from './game-state';

export const createInitialState = (
  level: Level,
  levelIndex: number,
  inventory: Item[],
): GameState => ({
  level,
  levelIndex,
  player: createPlayer(level),
  enemies: createEnemies(level),
  input: { isLeft: false, isRight: false, isJump: false },
  status: 'PLAYING',
  hasKey: false,
  isChestOpened: false,
  inventory,
  isNearChest: false,
  isNearPortal: false,
  time: 0,
  deaths: 0,
});
