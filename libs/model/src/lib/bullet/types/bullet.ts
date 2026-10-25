export interface Bullet {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: {
      current: number;
      max: number;
    };
  };
}
