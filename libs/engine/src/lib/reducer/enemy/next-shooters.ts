import { type Enemy, type Player } from '@mander/model';
import { compact, map } from 'lodash-es';
import { pipe } from 'remeda';
import { createShooterTickShot } from './internal/create-shooter-tick-shot';
import type { Salvo } from './types/salvo';

export const nextShooters = (
  enemies: Enemy[],
  player: Player,
  deltaSeconds: number,
): Salvo =>
  pipe(
    enemies,
    (patrolling) =>
      map(patrolling, (enemy) =>
        createShooterTickShot(enemy, player, deltaSeconds),
      ),
    (shots): Salvo => ({
      enemies: map(shots, (shot) => shot.enemy),
      cannonballs: compact(map(shots, (shot) => shot.cannonball)),
    }),
  );
