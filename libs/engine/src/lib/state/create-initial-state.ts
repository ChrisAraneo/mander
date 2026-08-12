import { findDiamondTiles, type Item } from '@mander/model';

import type { GameLevel } from '../types/game-level';
import { createCannons } from '../reducer/cannon/create-cannons';
import { createEnemies } from '../reducer/enemy/create-enemies';
import { createPlayer } from '../reducer/player/create-player';
import { startingHearts } from '../reducer/player/starting-hearts';
import type { GameState } from './types/game-state';

export const createInitialState = (
  level: GameLevel,
  levelIndex: number,
  inventory: Item[],
  score = 0,
): GameState => ({
  level,
  levelIndex,
  player: createPlayer(level, {
    hearts: { value: startingHearts(inventory) },
  }),
  enemies: createEnemies(level),
  cannons: createCannons(level),
  cannonballs: [],
  diamonds: findDiamondTiles(level),
  input: { isLeft: false, isRight: false, isJump: false },
  status: 'PLAYING',
  hasKey: false,
  isChestOpened: false,
  inventory,
  isNearChest: false,
  isNearPortal: false,
  time: 0,
  levelTimes: [],
  deaths: 0,
  score,
  updateTime: 0,
});
