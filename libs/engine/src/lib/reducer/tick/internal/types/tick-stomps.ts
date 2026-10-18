import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
  Player,
} from '@mander/model';
import type { GameState } from '../../../../types/game-state';

export interface TickStomps {
  state: GameState;
  deltaSeconds: number;
  isPlayerAlive: boolean;
  cannons: Cannon[];
  flying: Cannonball[];
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  flyingBullets: Bullet[];
  bounced: Player;
  afterStomps: Enemy[];
}
