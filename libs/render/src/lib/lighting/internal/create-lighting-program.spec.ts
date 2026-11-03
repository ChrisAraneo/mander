import { filter } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRecordingGl } from '../../../test/create-recording-gl';
import { createLightingProgram } from './create-lighting-program';

describe('createLightingProgram', () => {
  it('should attach both shaders and link them when it is created', () => {
    const { gl, calls } = createRecordingGl();

    createLightingProgram(gl);

    expect(
      filter(
        calls,
        ({ name }) => name !== 'shaderSource' && name !== 'compileShader',
      ),
    ).toEqual([
      { name: 'attachShader', args: ['program', 'shader:VERTEX_SHADER'] },
      { name: 'attachShader', args: ['program', 'shader:FRAGMENT_SHADER'] },
      { name: 'linkProgram', args: ['program'] },
    ]);
  });

  it('should give back the program when it links', () => {
    expect(createLightingProgram(createRecordingGl().gl)).toBe('program');
  });

  it('should give nothing when it does not link', () => {
    expect(
      createLightingProgram(createRecordingGl({ isLinked: false }).gl),
    ).toBeUndefined();
  });
});
