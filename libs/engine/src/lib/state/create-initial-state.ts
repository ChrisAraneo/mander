import type { Item } from '@mander/model';

import type { GameLevel } from '../game-level';
import { createEnemies } from '../reducer/enemy/create-enemies';
import { capabilitiesFor } from '../reducer/player/capabilities-for';
import { createPlayer } from '../reducer/player/create-player';
import { startingHearts } from '../reducer/player/starting-hearts';
import type { GameState } from './game-state';

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
    velocity: capabilitiesFor(),
  }),
  enemies: createEnemies(level),
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
});
