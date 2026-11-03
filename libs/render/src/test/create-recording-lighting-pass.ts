import { pipe } from 'remeda';
import { createLightingUniforms } from '../lib/lighting/internal/create-lighting-uniforms';
import { createRecordingGl } from './create-recording-gl';
import type { RecordingGlOptions } from './types/recording-gl-options';
import type { RecordingLightingPass } from './types/recording-lighting-pass';

export const createRecordingLightingPass = (
  options: RecordingGlOptions = {},
): RecordingLightingPass =>
  pipe(createRecordingGl(options), ({ gl, calls }) => ({
    calls,
    pass: {
      canvas: { width: 0, height: 0 } as unknown as HTMLCanvasElement,
      gl,
      uniforms: createLightingUniforms(gl, {} as unknown as WebGLProgram),
      uploaded: { tiles: undefined },
    },
  }));
