import { match } from 'ts-pattern';
import { FACING_LEFT, FACING_RIGHT } from '../consts';
import type { Facing } from '../types/facing';

export const toFacing = (isFacingRight: boolean): Facing =>
  match(isFacingRight)
    .with(true, (): Facing => FACING_RIGHT)
    .otherwise((): Facing => FACING_LEFT);
