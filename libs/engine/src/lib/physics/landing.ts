import { match } from 'ts-pattern';

export interface Landing {
  isGrounded: boolean;
  vy: number;
}

export const resolveLanding = (
  isBlocked: boolean,
  isFalling: boolean,
  isGrounded: boolean,
  vy: number,
): Landing =>
  match({ isBlocked, isFalling })
    .with({ isBlocked: true, isFalling: true }, () => ({
      isGrounded: true,
      vy: 0,
    }))
    .with({ isBlocked: true, isFalling: false }, () => ({ isGrounded, vy: 0 }))
    .with({ isBlocked: false, isFalling: true }, () => ({
      isGrounded: false,
      vy,
    }))
    .with({ isBlocked: false, isFalling: false }, () => ({ isGrounded, vy }))
    .exhaustive();
