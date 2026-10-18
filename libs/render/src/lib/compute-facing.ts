import { match } from 'ts-pattern';

export const computeFacing = (isFacingRight: boolean): number =>
  match(isFacingRight)
    .with(true, () => 1)
    .otherwise(() => -1);
