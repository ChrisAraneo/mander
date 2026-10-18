import type { CanvasCall } from './canvas-call';

export interface RecordingContext {
  context: CanvasRenderingContext2D;
  calls: CanvasCall[];
}
