export interface Enemy {
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
