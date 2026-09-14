import { findGemTiles, type Item } from '@mander/model';
import { chain } from '@mander/utils';

import type { GameLevel } from '../types/game-level';
import { countStartingAmmo } from '../reducer/bullet/count-starting-ammo';
import { createCannons } from '../reducer/cannon/create-cannons';
import { createEnemies } from '../reducer/enemy/create-enemies';
import { createFallingSpikes } from '../reducer/falling-spike/create-falling-spikes';
import { createFireballs } from '../reducer/fireball/create-fireballs';
import { createPlayerFireballs } from '../reducer/fireball/create-player-fireballs';
import { createPlayer } from '../reducer/player/create-player';
import { countStartingHearts } from '../reducer/player/count-starting-hearts';
import { countStartingStars } from '../reducer/use-star/count-starting-stars';
import type { GameState } from './types/game-state';

export const createInitialState = (
  level: GameLevel,
  levelIndex: number,
  inventory: Item[],
  score = 0,
): GameState =>
  chain(
    createPlayer(level, { hearts: { value: countStartingHearts(inventory) } }),
  )
    .thru((player): GameState => ({
      level,
      levelIndex,
      player,
      enemies: createEnemies(level),
      cannons: createCannons(level),
      cannonballs: [],
      fallingSpikes: createFallingSpikes(level),
      fireballs: createFireballs(level),
      playerFireballs: createPlayerFireballs(inventory, player),
      bullets: [],
      ammo: countStartingAmmo(inventory),
      stars: countStartingStars(inventory),
      gems: findGemTiles(level),
      input: { isLeft: false, isRight: false, isJump: false },
      status: 'PLAYING',
      hasKey: false,
      isChestOpened: false,
      inventory,
      isMoonMagnetOn: true,
      isNearChest: false,
      isNearPortal: false,
      time: 0,
      levelTimes: [],
      deaths: 0,
      score,
      updateTime: 0,
    }))
    .value();
