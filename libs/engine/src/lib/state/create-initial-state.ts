import type { Item, Level } from '@mander/generator';
import { createEnemies } from './create-enemies';
import { createPlayer } from './create-player';
import type { GameState } from './game-state';

export function createInitialState(
  level: Level,
  levelIndex: number,
  inventory: Item[]
): GameState {
  return {
    level,
    levelIndex,
    player: createPlayer(level),
    enemies: createEnemies(level),
    input: { left: false, right: false, jump: false },
    status: 'playing',
    hasKey: false,
    chestOpened: false,
    inventory,
    nearChest: false,
    nearPortal: false,
    time: 0,
    deaths: 0,
  };
}
