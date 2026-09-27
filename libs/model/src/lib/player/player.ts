export interface Player {
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
  hearts: {
    value: number;
  };
  timers: {
    death: number | null;
    invincibility: number;
    star: number;
    hurt: number;
  };
  statuses: {
    isFacingRight: boolean;
    isGrounded: boolean;
    isJumpQueued: boolean;
  };
}
