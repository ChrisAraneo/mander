import { match } from 'ts-pattern';
import { FACING_LEFT, FACING_RIGHT } from './consts';
import type { Facing } from './types/facing';

const RIGHTWARD_STEP = 1;

const LEFTWARD_STEP = -1;

export const computeFacingStep = (facing: Facing): number =>
  match(facing)
    .with(FACING_RIGHT, () => RIGHTWARD_STEP)
    .with(FACING_LEFT, () => LEFTWARD_STEP)
    .exhaustive();
