export interface Screen {
  readonly buffer: CanvasRenderingContext2D;
  fit(): void;
  present(): void;
  dispose(): void;
}
