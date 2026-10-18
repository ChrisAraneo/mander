import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
  Item,
  Player,
  Point,
} from '@mander/model';
import type { GameLevel } from './game-level';
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
