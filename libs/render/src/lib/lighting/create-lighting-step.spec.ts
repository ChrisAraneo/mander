import { find, map, noop, size, tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { createRecordingLightingPass } from '../../test/create-recording-lighting-pass';
import { createRenderTestState } from '../../test/create-render-test-state';
import { createLightingStep } from './create-lighting-step';
import type { LightingScene } from './types/lighting-scene';

const SCENE: LightingScene = {
  state: createRenderTestState(['.@.', '###']),
  viewport: { width: 320, height: 160, scale: 2 },
  cameraX: 0,
  cameraY: 0,
};

describe('createLightingStep', () => {
  it('should lay the light over the scene with the hard light blend when the context is alive', () => {
    const { pass } = createRecordingLightingPass();
    const { context, calls } = createRecordingContext();

    createLightingStep(pass, SCENE)(context);

    expect(calls).toEqual([
      { name: 'save', args: [] },
      { name: 'set globalCompositeOperation', args: ['hard-light'] },
      { name: 'set imageSmoothingEnabled', args: [true] },
      { name: 'drawImage', args: [pass.canvas, 0, 0, 324, 165] },
      { name: 'restore', args: [] },
    ]);
  });

  it('should slide the light with the camera when the camera sits between light pixels', () => {
    const { pass } = createRecordingLightingPass();
    const { context, calls } = createRecordingContext();

    createLightingStep(pass, { ...SCENE, cameraX: 4.5, cameraY: 7 })(context);

    expect(find(calls, { name: 'drawImage' })?.args).toEqual([
      pass.canvas,
      -1.5,
      -1,
      324,
      165,
    ]);
  });

  it('should run the shaders before the light is laid over the scene', () => {
    const { pass, calls } = createRecordingLightingPass();
    const drawnBefore: number[] = [];
    const context = {
      save: noop,
      restore: noop,
      drawImage: () => tap(0, () => drawnBefore.push(size(calls))),
    } as unknown as CanvasRenderingContext2D;

    createLightingStep(pass, SCENE)(context);

    expect(drawnBefore).toEqual([size(calls)]);
    expect(map(calls, 'name')).toContain('drawArrays');
  });

  it('should draw nothing and leave the scene alone when the context is lost', () => {
    const { pass, calls: glCalls } = createRecordingLightingPass({
      isLost: true,
    });
    const { context, calls } = createRecordingContext();

    createLightingStep(pass, SCENE)(context);

    expect(calls).toEqual([]);
    expect(glCalls).toEqual([]);
  });
});
