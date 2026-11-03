import type { LightingPass } from '../../lib/lighting/types/lighting-pass';
import type { CanvasCall } from './canvas-call';

export interface RecordingLightingPass {
  pass: LightingPass;
  calls: CanvasCall[];
}
