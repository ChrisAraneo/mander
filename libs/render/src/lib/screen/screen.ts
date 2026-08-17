/**
 * Owns the visible canvas and the offscreen buffer the game is drawn into.
 * The game never touches the display directly: it paints a clean frame into
 * `buffer`, and `present` re-photographs that frame onto the display.
 */
export interface Screen {
  /** The 2D target every draw call goes to. */
  readonly buffer: CanvasRenderingContext2D;
  /** Matches buffer and display to the element's box. Call before drawing. */
  fit(): void;
  /** Composites the drawn buffer onto the display. */
  present(): void;
  /** Releases the GPU resources behind the screen. */
  dispose(): void;
}
