import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
  Player,
  Snowball,
} from '@mander/model';
import type { GameState } from '../../../../types/game-state';
import type { GameStatus } from '../../../../types/game-status';

export interface TickHarm {
  state: GameState;
  deltaSeconds: number;
  cannons: Cannon[];
  flying: Cannonball[];
  snowballs: Snowball[];
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  flyingBullets: Bullet[];
  afterStomps: Enemy[];
  gored: Enemy[];
  hits: Cannonball[];
  chills: Snowball[];
  player: Player;
  deaths: number;
  status: GameStatus;
}
