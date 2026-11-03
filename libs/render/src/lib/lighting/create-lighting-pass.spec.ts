import { tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRecordingGl } from '../../test/create-recording-gl';
import { createLightingPass } from './create-lighting-pass';

const createCanvas = (
  gl: WebGL2RenderingContext | null,
  requests: unknown[] = [],
): HTMLCanvasElement =>
  ({
    getContext: (...request: unknown[]) =>
      tap(gl, () => requests.push(request)),
  }) as unknown as HTMLCanvasElement;

describe('createLightingPass', () => {
  it('should give no pass when the browser has no WebGL2', () => {
    expect(createLightingPass(createCanvas(null))).toBeUndefined();
  });

  it('should give no pass when the shaders do not link', () => {
    const { gl } = createRecordingGl({ isLinked: false });

    expect(createLightingPass(createCanvas(gl))).toBeUndefined();
  });

  it('should give no pass when the only renderer is software', () => {
    const { gl } = createRecordingGl({ renderer: 'SwiftShader driver' });

    expect(createLightingPass(createCanvas(gl))).toBeUndefined();
  });

  it('should keep the canvas and the context when the shaders link', () => {
    const { gl } = createRecordingGl();
    const canvas = createCanvas(gl);

    expect(createLightingPass(canvas)?.canvas).toBe(canvas);
    expect(createLightingPass(canvas)?.gl).toBe(gl);
  });

  it('should refuse a software renderer when it asks for the context', () => {
    const requests: unknown[] = [];

    createLightingPass(createCanvas(null, requests));

    expect(requests).toEqual([
      [
        'webgl2',
        {
          antialias: false,
          depth: false,
          stencil: false,
          failIfMajorPerformanceCaveat: true,
        },
      ],
    ]);
  });
});
