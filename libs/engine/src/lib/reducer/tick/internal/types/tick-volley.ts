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
import type { GameLevel } from '../../../../types/game-level';
import type { GameState } from '../../../../types/game-state';
import type { GameStatus } from '../../../../types/game-status';

export interface TickVolley {
  state: GameState;
  deltaSeconds: number;
  cannons: Cannon[];
  flying: Cannonball[];
  snowballs: Snowball[];
  fireballs: Fireball[];
  hits: Cannonball[];
  chills: Snowball[];
  player: Player;
  deaths: number;
  status: GameStatus;
  bullets: Bullet[];
  shot: Enemy[];
  unshot: FallingSpike[];
  level: GameLevel;
}
