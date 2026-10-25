export interface FallingSpike {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    y: {
      current: number;
      max: number;
    };
  };
  statuses: {
    isFalling: boolean;
  };
}
