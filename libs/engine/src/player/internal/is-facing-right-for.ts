import { match } from 'ts-pattern';

const NO_DIRECTION = 0;

export const isFacingRightFor = (
  direction: number,
  isFacingRight: boolean,
): boolean =>
  match(direction)
    .with(NO_DIRECTION, () => isFacingRight)
    .otherwise(() => direction > 0);
