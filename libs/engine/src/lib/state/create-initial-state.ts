import { findGemTiles, type Item } from '@mander/model';
import { countStartingAmmo } from '../reducer/bullet/count-starting-ammo';
import { createCannons } from '../reducer/cannon/create-cannons';
import { createEnemies } from '../reducer/enemy/create-enemies';
import { createFallingSpikes } from '../reducer/falling-spike/create-falling-spikes';
import { createFireballs } from '../reducer/fireball/create-fireballs';
import { countStartingHearts } from '../reducer/player/count-starting-hearts';
import { createPlayer } from '../reducer/player/create-player';
import { countStartingStars } from '../reducer/use-star/count-starting-stars';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';

export const createInitialState = (
  level: GameLevel,
  levelIndex: number,
  inventory: Item[],
  score = 0,
): GameState => ({
  level,
  levelIndex,
  player: createPlayer(level, {
    hearts: { value: countStartingHearts(inventory) },
  }),
  enemies: createEnemies(level),
  cannons: createCannons(level),
  cannonballs: [],
  snowballs: [],
  fallingSpikes: createFallingSpikes(level),
  fireballs: createFireballs(level),
  bullets: [],
  ammo: countStartingAmmo(inventory),
  stars: countStartingStars(inventory),
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
