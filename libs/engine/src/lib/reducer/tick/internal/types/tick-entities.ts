import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
  Player,
  Point,
  Snowball,
} from '@mander/model';
import type { GameLevel } from '../../../../types/game-level';
import type { GameState } from '../../../../types/game-state';
import type { GameStatus } from '../../../../types/game-status';

export interface TickEntities {
  state: GameState;
  deltaSeconds: number;
  cannons: Cannon[];
  fireballs: Fireball[];
  player: Player;
  deaths: number;
  status: GameStatus;
  bullets: Bullet[];
  unshot: FallingSpike[];
  level: GameLevel;
  enemies: Enemy[];
  cannonballs: Cannonball[];
  snowballs: Snowball[];
  canReach: boolean;
  gems: Point[];
}
