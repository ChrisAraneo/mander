import type { Enemy } from '@mander/model';
import { match } from 'ts-pattern';

const WOBBLE_SPEED = 9;

const WOBBLE_PHASE_STEP = 0.2;

const WOBBLE_HEIGHT = 1.2;

export const computeEnemyWobble = (
  enemy: Enemy,
  isDying: boolean,
  time: number,
): number =>
  match(enemy.statuses.isGrounded && !isDying && enemy.kind !== 'BEARTRAP')
    .with(
      true,
      () =>
        Math.sin(time * WOBBLE_SPEED + enemy.spawn.x * WOBBLE_PHASE_STEP) *
        WOBBLE_HEIGHT,
    )
    .otherwise(() => 0);
