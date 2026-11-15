import { match } from 'ts-pattern';

export const computeBlockedVelocityX = (
  isBlocked: boolean,
  velocityX: number,
): number =>
  match(isBlocked)
    .with(true, () => 0)
    .otherwise(() => velocityX);
