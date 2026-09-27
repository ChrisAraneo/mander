export interface Sweep {
  origin: number;
  delta: number;
  size: number;
  isColliding: (position: number) => boolean;
}
