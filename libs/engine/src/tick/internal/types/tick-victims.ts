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

export interface TickVictims {
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
  gored: Enemy[];
  hits: Cannonball[];
  chills: Snowball[];
  isBurned: boolean;
  isFrozen: boolean;
}
