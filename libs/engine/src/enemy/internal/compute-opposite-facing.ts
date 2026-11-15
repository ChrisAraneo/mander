import { match } from 'ts-pattern';
import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import type { Facing } from '../../facing/types/facing';

export const computeOppositeFacing = (facing: Facing): Facing =>
  match(facing)
    .with(FACING_RIGHT, (): Facing => FACING_LEFT)
    .with(FACING_LEFT, (): Facing => FACING_RIGHT)
    .exhaustive((): Facing => FACING_RIGHT);
