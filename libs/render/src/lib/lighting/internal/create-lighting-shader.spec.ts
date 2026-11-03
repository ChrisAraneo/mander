import { describe, expect, it } from 'vitest';

import { createRecordingGl } from '../../../test/create-recording-gl';
import { createLightingShader } from './create-lighting-shader';

describe('createLightingShader', () => {
  it('should give the source to the shader and compile it when it is created', () => {
    const { gl, calls } = createRecordingGl();

    createLightingShader(gl, gl.VERTEX_SHADER, 'SOURCE');

    expect(calls).toEqual([
      { name: 'shaderSource', args: ['shader:VERTEX_SHADER', 'SOURCE'] },
      { name: 'compileShader', args: ['shader:VERTEX_SHADER'] },
    ]);
  });

  it('should give back the shader when it is created', () => {
    const { gl } = createRecordingGl();

    expect(createLightingShader(gl, gl.FRAGMENT_SHADER, 'SOURCE')).toBe(
      'shader:FRAGMENT_SHADER',
    );
  });
});
