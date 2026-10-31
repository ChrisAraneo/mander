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

export interface TickHazards {
  state: GameState;
  deltaSeconds: number;
  moved: Player;
  isPlayerAlive: boolean;
  steppedEnemies: Enemy[];
  cannons: Cannon[];
  flying: Cannonball[];
  snowballs: Snowball[];
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  flyingBullets: Bullet[];
}
