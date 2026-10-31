import { type Enemy, type Player } from '@mander/model';
import { compact, map } from 'lodash-es';
import { pipe } from 'remeda';
import { createFreezingTickShot } from './internal/create-freezing-tick-shot';
import type { Blizzard } from './types/blizzard';

export const nextFreezers = (
  enemies: Enemy[],
  player: Player,
  deltaSeconds: number,
): Blizzard =>
  pipe(
    enemies,
    (patrolling) =>
      map(patrolling, (enemy) =>
        createFreezingTickShot(enemy, player, deltaSeconds),
      ),
    (shots): Blizzard => ({
      enemies: map(shots, (shot) => shot.enemy),
      snowballs: compact(map(shots, (shot) => shot.snowball)),
    }),
  );
