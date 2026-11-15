import { match } from 'ts-pattern';
import type { Landing } from './types/landing';

export const computeLanding = (
  isBlocked: boolean,
  isFalling: boolean,
  isGrounded: boolean,
  velocityY: number,
): Landing =>
  match({ isBlocked, isFalling })
    .with({ isBlocked: true, isFalling: true }, () => ({
      isGrounded: true,
      velocityY: 0,
    }))
    .with({ isBlocked: true, isFalling: false }, () => ({
      isGrounded,
      velocityY: 0,
    }))
    .with({ isBlocked: false, isFalling: true }, () => ({
      isGrounded: false,
      velocityY,
    }))
    .with({ isBlocked: false, isFalling: false }, () => ({
      isGrounded,
      velocityY,
    }))
    .exhaustive();
