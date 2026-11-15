import { findGemTiles, type Item } from '@mander/model';
import { computeStartingAmmo } from '../bullet/compute-starting-ammo';
import { createCannons } from '../cannon/create-cannons';
import { createEnemies } from '../enemy/create-enemies';
import { createFallingSpikes } from '../falling-spike/create-falling-spikes';
import { createFireballs } from '../fireball/create-fireballs';
import { computeStartingHearts } from '../player/compute-starting-hearts';
import { createPlayer } from '../player/create-player';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { computeStartingStars } from '../use-star/compute-starting-stars';

export const createInitialState = (
  level: GameLevel,
  levelIndex: number,
  inventory: Item[],
  score = 0,
): GameState => ({
  level,
  levelIndex,
  player: createPlayer(level, {
    hearts: { value: computeStartingHearts(inventory) },
  }),
  enemies: createEnemies(level),
  cannons: createCannons(level),
  cannonballs: [],
  snowballs: [],
  fallingSpikes: createFallingSpikes(level),
  fireballs: createFireballs(level),
  bullets: [],
  ammo: computeStartingAmmo(inventory),
  stars: computeStartingStars(inventory),
  gems: findGemTiles(level),
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
