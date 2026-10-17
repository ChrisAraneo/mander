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
import type { GameStatus } from '../../../../types/game-status';

export interface TickHarm {
  state: GameState;
  deltaSeconds: number;
  isPlayerAlive: boolean;
  cannons: Cannon[];
  flying: Cannonball[];
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  playerFireballs: Fireball[];
  flyingBullets: Bullet[];
  afterStomps: Enemy[];
  gored: Enemy[];
  hits: Cannonball[];
  player: Player;
  deaths: number;
  status: GameStatus;
}
