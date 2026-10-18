import { match } from 'ts-pattern';

export const computeVelocityFacing = (velocityX: number): number =>
  match(velocityX < 0)
    .with(true, () => -1)
    .otherwise(() => 1);
