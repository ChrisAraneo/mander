import type { Item, Level } from '../world';

import type { Enemy } from '../world/enemy/enemy';
import type { GameStatus } from './game-status';
import type { InputState } from './input-state';
import type { Player } from '../world/player/player';

export interface GameState {
  level: Level;
  levelIndex: number;
  player: Player;
  enemies: Enemy[];
  input: InputState;
  status: GameStatus;
  hasKey: boolean;
  isChestOpened: boolean;
  inventory: Item[];
  isNearChest: boolean;
  isNearPortal: boolean;
  time: number;
  deaths: number;
}
