import { findDiamondTiles } from '@mander/model';
import { chain } from '@mander/utils';

import type { GameState } from '../../state/types/game-state';
import { createCannons } from '../cannon/create-cannons';
import { createEnemies } from '../enemy/create-enemies';
import { createFallingSpikes } from '../falling-spike/create-falling-spikes';
import { createFireballs } from '../fireball/create-fireballs';
import { createPlayerFireballs } from '../fireball/create-player-fireballs';
import { createPlayer } from '../player/create-player';

export const loadLevel = (
  state: GameState,
  level: GameState['level'],
  levelIndex: number,
): GameState =>
  chain(createPlayer(level, state.player))
    .thru((player): GameState => ({
      ...state,
      level,
      levelIndex,
      player,
      enemies: createEnemies(level),
      cannons: createCannons(level),
      cannonballs: [],
      fallingSpikes: createFallingSpikes(level),
      fireballs: createFireballs(level),
      playerFireballs: createPlayerFireballs(state.inventory, player),
      bullets: [],
      diamonds: findDiamondTiles(level),
      status: 'PLAYING',
      hasKey: false,
      isChestOpened: false,
      isNearChest: false,
      isNearPortal: false,
      time: 0,
    }))
    .value();
