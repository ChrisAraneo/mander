import { describe, expect, it } from 'vitest';

import { createRecordingLightingPass } from '../../../test/create-recording-lighting-pass';
import { createRenderTestState } from '../../../test/create-render-test-state';
import { SUN_X, SUN_Y } from '../../sun/consts';
import type { LightGrid } from '../types/light-grid';
import type { LightingScene } from '../types/lighting-scene';
import { patchLightingUniforms } from './patch-lighting-uniforms';

const SCENE: LightingScene = {
  state: createRenderTestState(['.@.', '###']),
  viewport: { width: 320, height: 160, scale: 1 },
  cameraX: 13,
  cameraY: 35,
};

const GRID: LightGrid = {
  x: 12,
  y: 33,
  width: 327,
  height: 165,
  columns: 109,
  rows: 55,
};

describe('patchLightingUniforms', () => {
  it('should send where the light pixels start and how far they reach when the scene is drawn', () => {
    const { pass, calls } = createRecordingLightingPass();

    patchLightingUniforms(pass, SCENE, GRID);

    expect(calls.slice(0, 2)).toEqual([
      { name: 'uniform2f', args: ['location:uLightOrigin', 12, 33] },
      { name: 'uniform2f', args: ['location:uLightSize', 327, 165] },
    ]);
  });

  it('should keep the glow on the sun when the light pixels start behind the camera', () => {
    const { pass, calls } = createRecordingLightingPass();

    patchLightingUniforms(pass, SCENE, GRID);

    expect(calls[2]).toEqual({
      name: 'uniform2f',
      args: ['location:uSun', SUN_X + 1, SUN_Y + 2],
    });
  });

  it('should send the occluders after the points when the scene is drawn', () => {
    const { pass, calls } = createRecordingLightingPass();

    patchLightingUniforms(pass, SCENE, GRID);

    expect(calls[4]).toEqual({
      name: 'uniform1i',
      args: ['location:uOccluderCount', 1],
    });
  });
});
