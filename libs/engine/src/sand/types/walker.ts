import type { Point } from '@mander/model';

export interface Walker {
  position: Point;
  statuses: { isGrounded: boolean };
}
