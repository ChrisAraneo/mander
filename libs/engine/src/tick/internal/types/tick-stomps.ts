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
import type { GameState } from '../../../state/types/game-state';

export interface TickStomps {
  state: GameState;
  deltaSeconds: number;
  isPlayerAlive: boolean;
  cannons: Cannon[];
  cannonballs: Cannonball[];
  snowballs: Snowball[];
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  flyingBullets: Bullet[];
  bounced: Player;
  afterStomps: Enemy[];
}
