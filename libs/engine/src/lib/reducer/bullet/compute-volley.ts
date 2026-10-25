import type { Bullet, Enemy, FallingSpike } from '@mander/model';
import { reduce } from 'lodash-es';
import type { GameLevel } from '../../types/game-level';
import { patchVolleyWithBullet } from './internal/patch-volley-with-bullet';
import type { Volley } from './types/volley';

export const computeVolley = (
  bullets: Bullet[],
  enemies: Enemy[],
  fallingSpikes: FallingSpike[],
  level: GameLevel,
): Volley =>
  reduce<Bullet, Volley>(bullets, patchVolleyWithBullet, {
    bullets: [],
    enemies,
    fallingSpikes,
    level,
  });
