import type { Bullet, Enemy, FallingSpike } from '@mander/model';

import type { GameLevel } from '../../../types/game-level';

export interface Volley {
  bullets: Bullet[];
  enemies: Enemy[];
  fallingSpikes: FallingSpike[];
  level: GameLevel;
}
