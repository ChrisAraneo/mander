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

export interface TickHazards {
  state: GameState;
  deltaSeconds: number;
  moved: Player;
  isPlayerAlive: boolean;
  steppedEnemies: Enemy[];
  cannons: Cannon[];
  flying: Cannonball[];
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  playerFireballs: Fireball[];
  flyingBullets: Bullet[];
}
