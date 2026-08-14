import type {
  Cannon,
  Cannonball,
  Enemy,
  Fireball,
  Item,
  Player,
} from '@mander/model';
import type { Point } from '@mander/utils';

import type { GameLevel } from '../../types/game-level';
import type { GameStatus } from './game-status';
import type { InputState } from './input-state';

export interface GameState {
  level: GameLevel;
  levelIndex: number;
  player: Player;
  enemies: Enemy[];
  cannons: Cannon[];
  cannonballs: Cannonball[];
  fireballs: Fireball[];
  diamonds: Point[];
  input: InputState;
  status: GameStatus;
  hasKey: boolean;
  isChestOpened: boolean;
  inventory: Item[];
  isNearChest: boolean;
  isNearPortal: boolean;
  time: number;
  levelTimes: number[];
  deaths: number;
  score: number;
  updateTime: number;
}
