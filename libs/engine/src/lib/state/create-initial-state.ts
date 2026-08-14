import { findDiamondTiles, type Item } from '@mander/model';

import type { GameLevel } from '../types/game-level';
import { startingAmmo } from '../reducer/bullet/starting-ammo';
import { createCannons } from '../reducer/cannon/create-cannons';
import { createEnemies } from '../reducer/enemy/create-enemies';
import { createFireballs } from '../reducer/fireball/create-fireballs';
import { createPlayer } from '../reducer/player/create-player';
import { startingHearts } from '../reducer/player/starting-hearts';
import { startingStars } from '../reducer/use-star/starting-stars';
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
  fireballs: createFireballs(level),
  bullets: [],
  ammo: startingAmmo(inventory),
  stars: startingStars(inventory),
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
