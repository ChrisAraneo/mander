import type { MoveDirection } from './move-direction';

export interface MovePlan {
  direction: MoveDirection;
  jumpFrames: number;
}
