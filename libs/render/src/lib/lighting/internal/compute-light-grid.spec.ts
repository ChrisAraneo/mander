import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../../test/create-render-test-state';
import { LIGHT_TEXEL_SIZE } from '../consts';
import type { LightingScene } from '../types/lighting-scene';
import { computeLightGrid } from './compute-light-grid';

const createScene = (cameraX: number, cameraY: number): LightingScene => ({
  state: createRenderTestState(['.@.', '###']),
  viewport: { width: 330, height: 168, scale: 1 },
  cameraX,
  cameraY,
});

describe('computeLightGrid', () => {
  it('should start on the camera when the camera sits on a light pixel', () => {
    expect(computeLightGrid(createScene(30, 60))).toMatchObject({
      x: 30,
      y: 60,
    });
  });

  it('should stay on the same world position when the camera moves by less than a light pixel', () => {
    expect(computeLightGrid(createScene(30.5, 61.9))).toMatchObject({
      x: 30,
      y: 60,
    });
  });

  it('should move by a whole light pixel when the camera crosses one', () => {
    expect(computeLightGrid(createScene(33, 63))).toMatchObject({
      x: 33,
      y: 63,
    });
  });

  it('should step towards the left when the camera is left of the world', () => {
    expect(computeLightGrid(createScene(-1, -1))).toMatchObject({
      x: -LIGHT_TEXEL_SIZE,
      y: -LIGHT_TEXEL_SIZE,
    });
  });

  it('should hold one spare light pixel when the view divides evenly', () => {
    expect(computeLightGrid(createScene(0, 0))).toMatchObject({
      columns: 111,
      rows: 57,
    });
  });

  it('should still cover the whole view when the camera is furthest from the grid', () => {
    const cameraX = LIGHT_TEXEL_SIZE - 0.01;
    const cameraY = LIGHT_TEXEL_SIZE - 0.01;

    const grid = computeLightGrid(createScene(cameraX, cameraY));

    expect(grid.x + grid.width).toBeGreaterThanOrEqual(cameraX + 330);
    expect(grid.y + grid.height).toBeGreaterThanOrEqual(cameraY + 168);
  });
});
