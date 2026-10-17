import { match } from 'ts-pattern';
import type { Facing } from '../../types/facing';
import { computeOppositeFacing } from './compute-opposite-facing';

export const computeBlockedFacing = (
  isBlocked: boolean,
  facing: Facing,
): Facing =>
  match(isBlocked)
    .with(true, () => computeOppositeFacing(facing))
    .otherwise(() => facing);
