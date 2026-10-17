import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
  Player,
} from '@mander/model';
import type { GameLevel } from '../../../../types/game-level';
import type { GameState } from '../../../../types/game-state';
import type { GameStatus } from '../../../../types/game-status';

export interface TickVolley {
  state: GameState;
  deltaSeconds: number;
  isPlayerAlive: boolean;
  cannons: Cannon[];
  flying: Cannonball[];
  fireballs: Fireball[];
  playerFireballs: Fireball[];
  hits: Cannonball[];
  player: Player;
  deaths: number;
  status: GameStatus;
  bullets: Bullet[];
  shot: Enemy[];
  unshot: FallingSpike[];
  level: GameLevel;
}
