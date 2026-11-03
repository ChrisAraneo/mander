import { describe, expect, it } from 'vitest';

import { createRecordingGl } from '../../../test/create-recording-gl';
import { createLightingUniforms } from './create-lighting-uniforms';
import { patchLightingDefaults } from './patch-lighting-defaults';

const PROGRAM = {} as unknown as WebGLProgram;

describe('patchLightingDefaults', () => {
  it('should set up the program and an exact tile texture when the pass opens', () => {
    const { gl, calls } = createRecordingGl();

    patchLightingDefaults(gl, PROGRAM, createLightingUniforms(gl, PROGRAM));

    expect(calls).toEqual([
      { name: 'useProgram', args: [PROGRAM] },
      { name: 'bindTexture', args: ['TEXTURE_2D', 'texture'] },
      {
        name: 'texParameteri',
        args: ['TEXTURE_2D', 'TEXTURE_MIN_FILTER', 'NEAREST'],
      },
      {
        name: 'texParameteri',
        args: ['TEXTURE_2D', 'TEXTURE_MAG_FILTER', 'NEAREST'],
      },
      { name: 'pixelStorei', args: ['UNPACK_ALIGNMENT', 1] },
      { name: 'uniform1i', args: ['location:uTiles', 0] },
    ]);
  });
});
