export interface Palette {
  /** Sky gradient, from the top of the view down to the horizon. */
  sky: readonly [string, string, string];
  /** Parallax hills, far layer first. */
  hills: readonly [string, string];
  block: string;
  blockCap: string;
  blockCapHighlight: string;
}
