import { describe, expect, it } from 'vitest';

import { createRecordingGl } from '../../../test/create-recording-gl';
import { createOpenedLightingPass } from './create-opened-lighting-pass';

const CANVAS = {} as unknown as HTMLCanvasElement;

describe('createOpenedLightingPass', () => {
  it('should give a pass with nothing uploaded yet when the shaders link', () => {
    const { gl } = createRecordingGl();

    const pass = createOpenedLightingPass(CANVAS, gl);

    expect(pass?.canvas).toBe(CANVAS);
    expect(pass?.gl).toBe(gl);
    expect(pass?.uniforms.sun).toBe('location:uSun');
    expect(pass?.uploaded).toEqual({ tiles: undefined });
  });

  it('should give nothing when the shaders do not link', () => {
    const { gl } = createRecordingGl({ isLinked: false });

    expect(createOpenedLightingPass(CANVAS, gl)).toBeUndefined();
  });
});
