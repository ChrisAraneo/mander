import { GRAVITY } from '@mander/model';
import { match } from 'ts-pattern';
import type { InputState } from '../../../types/input-state';

const JUMP_CUT_GRAVITY_FACTOR = 2.6;

export const computePlayerGravity = (
  velocityY: number,
  input: InputState,
): number =>
  match(velocityY < 0 && !input.isJump)
    .with(true, () => GRAVITY * JUMP_CUT_GRAVITY_FACTOR)
    .otherwise(() => GRAVITY);
