import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
  Player,
} from '@mander/model';
import type { Point } from '@mander/utils';
import type { GameLevel } from '../../../../types/game-level';
import type { GameState } from '../../../../types/game-state';
import type { GameStatus } from '../../../../types/game-status';

export interface TickEntities {
  state: GameState;
  deltaSeconds: number;
  cannons: Cannon[];
  fireballs: Fireball[];
  playerFireballs: Fireball[];
  player: Player;
  deaths: number;
  status: GameStatus;
  bullets: Bullet[];
  unshot: FallingSpike[];
  level: GameLevel;
  enemies: Enemy[];
  cannonballs: Cannonball[];
  canReach: boolean;
  gems: Point[];
}
