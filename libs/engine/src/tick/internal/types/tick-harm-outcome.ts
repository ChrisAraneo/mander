import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
  Snowball,
} from '@mander/model';
import type { GameState } from '../../../state/types/game-state';
import type { TickOutcome } from './tick-outcome';

export interface TickHarmOutcome {
  state: GameState;
  deltaSeconds: number;
  cannons: Cannon[];
  cannonballs: Cannonball[];
  snowballs: Snowball[];
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  flyingBullets: Bullet[];
  afterStomps: Enemy[];
  gored: Enemy[];
  hits: Cannonball[];
  chills: Snowball[];
  isFrozen: boolean;
  outcome: TickOutcome;
}
