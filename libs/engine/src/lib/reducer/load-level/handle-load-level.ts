import { findGemTiles, chain } from '@mander/model';
import type { GameState } from '../../types/game-state';
import { createCannons } from '../cannon/create-cannons';
import { createEnemies } from '../enemy/create-enemies';
import { createFallingSpikes } from '../falling-spike/create-falling-spikes';
import { createFireballs } from '../fireball/create-fireballs';
import { createPlayer } from '../player/create-player';

export const handleLoadLevel = (
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
      bullets: [],
      gems: findGemTiles(level),
      status: 'PLAYING',
      hasKey: false,
      isChestOpened: false,
      isNearChest: false,
      isNearPortal: false,
      time: 0,
    }))
    .value();
