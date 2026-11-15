import { GRAVITY } from '@mander/model';
import { match } from 'ts-pattern';
import type { InputState } from '../../state/types/input-state';
import { JUMP_CUT_GRAVITY_FACTOR } from '../consts';

export const computePlayerGravity = (
  velocityY: number,
  input: InputState,
): number =>
  match(velocityY < 0 && !input.isJump)
    .with(true, () => GRAVITY * JUMP_CUT_GRAVITY_FACTOR)
    .otherwise(() => GRAVITY);
