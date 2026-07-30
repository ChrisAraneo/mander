import type { Item, Level } from '@mander/model';

import { createEnemies } from '../reducer/enemy/create-enemies';
import { capabilitiesFor } from '../reducer/player/capabilities-for';
import { createPlayer } from '../reducer/player/create-player';
import { startingHearts } from '../reducer/player/starting-hearts';
import type { GameState } from './game-state';

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
