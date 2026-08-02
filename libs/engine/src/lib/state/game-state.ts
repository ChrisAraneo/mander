import type { Enemy, Item, Level, Player } from '@mander/model';

import type { GameStatus } from './game-status';
import type { InputState } from './input-state';

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
