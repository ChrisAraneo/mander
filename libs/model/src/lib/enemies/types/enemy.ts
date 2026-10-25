import type { EnemyKind } from './enemy-kind';

export interface Enemy {
  kind: EnemyKind;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: {
      current: number;
      max: number;
    };
    y: {
      current: number;
      max: number;
    };
  };
  timers: {
    death: number | null;
  };
  spawn: {
    x: number;
    y: number;
  };
  statuses: {
    isFacingRight: boolean;
    isGrounded: boolean;
  };
}
