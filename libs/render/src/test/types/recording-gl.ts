import type { CanvasCall } from './canvas-call';

export interface RecordingGl {
  gl: WebGL2RenderingContext;
  calls: CanvasCall[];
}
