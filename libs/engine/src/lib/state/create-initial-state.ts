import type { Item, Level } from '../world';

import { capabilitiesFor } from './capabilities-for';
import { createEnemies } from './create-enemies';
import { createPlayer } from './create-player';
import type { GameState } from './game-state';
import { startingHearts } from './starting-hearts';

export const createInitialState = (
  level: Level,
  levelIndex: number,
  inventory: Item[],
): GameState => ({
  level,
  levelIndex,
  player: createPlayer(level, {
    hearts: { value: startingHearts(inventory) },
    velocity: capabilitiesFor(inventory),
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
  deaths: 0,
});
