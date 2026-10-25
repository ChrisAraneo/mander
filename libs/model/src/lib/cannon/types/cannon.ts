export interface Cannon {
  position: {
    x: number;
    y: number;
  };
  timers: {
    reload: number;
  };
  statuses: {
    isFacingRight: boolean;
  };
}
