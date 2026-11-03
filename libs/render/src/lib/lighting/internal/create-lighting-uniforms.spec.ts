import { describe, expect, it } from 'vitest';

import { createRecordingGl } from '../../../test/create-recording-gl';
import { createLightingUniforms } from './create-lighting-uniforms';

const PROGRAM = {} as unknown as WebGLProgram;

describe('createLightingUniforms', () => {
  it('should find every uniform the shader reads when the program is linked', () => {
    expect(createLightingUniforms(createRecordingGl().gl, PROGRAM)).toEqual({
      tiles: 'location:uTiles',
      levelSize: 'location:uLevelSize',
      origin: 'location:uLightOrigin',
      size: 'location:uLightSize',
      sun: 'location:uSun',
      occluders: 'location:uOccluders',
      occluderCount: 'location:uOccluderCount',
    });
  });
});
