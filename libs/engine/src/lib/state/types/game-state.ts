import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
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
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  playerFireballs: Fireball[];
  bullets: Bullet[];
  ammo: number;
  stars: number;
  gems: Point[];
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
