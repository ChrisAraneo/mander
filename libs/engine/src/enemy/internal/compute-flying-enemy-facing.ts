import { match } from 'ts-pattern';
import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import type { Facing } from '../../facing/types/facing';

const RESTING_SPEED = 0;

export const computeFlyingEnemyFacing = (velocityY: number): Facing =>
  match(velocityY < RESTING_SPEED)
    .with(true, (): Facing => FACING_LEFT)
    .otherwise((): Facing => FACING_RIGHT);
