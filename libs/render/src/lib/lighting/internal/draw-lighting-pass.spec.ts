import { last } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRecordingLightingPass } from '../../../test/create-recording-lighting-pass';
import { createRenderTestState } from '../../../test/create-render-test-state';
import type { LightGrid } from '../types/light-grid';
import type { LightingScene } from '../types/lighting-scene';
import { drawLightingPass } from './draw-lighting-pass';

const SCENE: LightingScene = {
  state: createRenderTestState(['.@.', '###']),
  viewport: { width: 330, height: 168, scale: 1 },
  cameraX: 0,
  cameraY: 0,
};

const GRID: LightGrid = {
  x: 0,
  y: 0,
  width: 333,
  height: 171,
  columns: 111,
  rows: 57,
};

describe('drawLightingPass', () => {
  it('should size its canvas to the light pixels when the scene is drawn', () => {
    const { pass } = createRecordingLightingPass();

    drawLightingPass(pass, SCENE, GRID);

    expect(pass.canvas).toEqual({ width: 111, height: 57 });
  });

  it('should upload the tiles of the level when the scene is drawn', () => {
    const { pass } = createRecordingLightingPass();

    drawLightingPass(pass, SCENE, GRID);

    expect(pass.uploaded.tiles).toBe(SCENE.state.level.tiles);
  });

  it('should cover the sized canvas and draw last when the scene is drawn', () => {
    const { pass, calls } = createRecordingLightingPass();

    drawLightingPass(pass, SCENE, GRID);

    expect(calls[calls.length - 2]).toEqual({
      name: 'viewport',
      args: [0, 0, 111, 57],
    });
    expect(last(calls)).toEqual({
      name: 'drawArrays',
      args: ['TRIANGLES', 0, 3],
    });
  });
});
