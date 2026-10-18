import { match } from 'ts-pattern';
import type { InputState } from '../../../types/input-state';

export const toHorizontalDirection = (input: InputState): number =>
  match(input)
    .with({ isRight: true, isLeft: false }, () => 1)
    .with({ isRight: false, isLeft: true }, () => -1)
    .otherwise(() => 0);
