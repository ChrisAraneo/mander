import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../../test/create-render-test-state';
import { LIGHT_OCCLUDER_MARGIN } from '../consts';
import type { LightOccluder } from '../types/light-occluder';
import type { LightingScene } from '../types/lighting-scene';
import { isLightOccluderInView } from './is-light-occluder-in-view';

const SCENE: LightingScene = {
  state: createRenderTestState(['.@.', '###']),
  viewport: { width: 320, height: 160, scale: 1 },
  cameraX: 1000,
  cameraY: 2000,
};

const createOccluder = (x: number, y: number): LightOccluder => ({
  x,
  y,
  width: 20,
  height: 40,
});

const MARGIN = LIGHT_OCCLUDER_MARGIN;

describe('isLightOccluderInView', () => {
  it('should be true when the occluder is on screen', () => {
    expect(isLightOccluderInView(createOccluder(1100, 2050), SCENE)).toBe(true);
  });

  it('should be true when the occluder is off screen but close enough to throw a shadow in', () => {
    expect(
      isLightOccluderInView(createOccluder(1000 - MARGIN, 2000), SCENE),
    ).toBe(true);
  });

  it('should be false when the occluder is too far to the left', () => {
    expect(
      isLightOccluderInView(createOccluder(1000 - MARGIN - 20, 2000), SCENE),
    ).toBe(false);
  });

  it('should be false when the occluder is too far to the right', () => {
    expect(
      isLightOccluderInView(createOccluder(1320 + MARGIN, 2000), SCENE),
    ).toBe(false);
  });

  it('should be false when the occluder is too far above', () => {
    expect(
      isLightOccluderInView(createOccluder(1000, 2000 - MARGIN - 40), SCENE),
    ).toBe(false);
  });

  it('should be false when the occluder is too far below', () => {
    expect(
      isLightOccluderInView(createOccluder(1000, 2160 + MARGIN), SCENE),
    ).toBe(false);
  });
});
