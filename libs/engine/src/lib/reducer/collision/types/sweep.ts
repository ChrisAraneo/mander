export interface Sweep {
  origin: number;
  delta: number;
  size: number;
  collides: (position: number) => boolean;
}
