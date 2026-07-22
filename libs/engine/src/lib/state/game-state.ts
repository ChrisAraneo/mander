import type { Item, Level } from '@mander/generator';

import type { Enemy } from './enemy';
import type { GameStatus } from './game-status';
import type { InputState } from './input-state';
import type { Player } from './player';

export interface GameState {
  level: Level;
  levelIndex: number;
  player: Player;
  enemies: Enemy[];
  input: InputState;
  status: GameStatus;
  hasKey: boolean;
  chestOpened: boolean;
  inventory: Item[];
  nearChest: boolean;
  nearPortal: boolean;
  time: number;
  deaths: number;
}
