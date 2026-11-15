import type { Player } from '@mander/model';
import { MAX_GROUNDED_FRAMES, MAX_PLAN_FRAMES } from '../consts';

export const isFlightSettled = (
  previous: Player,
  next: Player,
  frame: number,
): boolean =>
  (next.statuses.isGrounded && previous.statuses.isGrounded === false) ||
  (next.statuses.isGrounded && frame + 1 >= MAX_GROUNDED_FRAMES) ||
  frame + 1 >= MAX_PLAN_FRAMES;
