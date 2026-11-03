import { describe, expect, it } from 'vitest';

import { MAX_LIGHT_OCCLUDERS } from '../consts';
import { LIGHTING_FRAGMENT_SOURCE } from './lighting-fragment-source';

describe('LIGHTING_FRAGMENT_SOURCE', () => {
  it('should open with the version line because anything before it fails to compile', () => {
    expect(LIGHTING_FRAGMENT_SOURCE.startsWith('#version 300 es\n')).toBe(true);
  });

  it('should hold as many occluders as the renderer sends when it declares the array', () => {
    expect(LIGHTING_FRAGMENT_SOURCE).toContain(
      `uniform vec4 uOccluders[${MAX_LIGHT_OCCLUDERS}];`,
    );
  });

  it('should send the sunlight the same way everywhere so shadows ignore the camera', () => {
    expect(LIGHTING_FRAGMENT_SOURCE).toContain(
      'const vec2 SUN_RAY = vec2(-600.0, -1040.0);',
    );
  });

  it('should make the shadows of the player and enemies under a third as strong as those of blocks', () => {
    expect(LIGHTING_FRAGMENT_SOURCE).toContain(
      'const float OCCLUDER_VISIBILITY = 0.3;',
    );
  });

  it('should soften every shadow by the same amount when it works out what is visible', () => {
    expect(LIGHTING_FRAGMENT_SOURCE).toContain(
      'float visibleLit = 1.0 - (1.0 - lit) * SHADOW_VISIBILITY;',
    );
    expect(LIGHTING_FRAGMENT_SOURCE).toContain(
      'const float SHADOW_VISIBILITY = 0.75;',
    );
  });

  it('should write out the tile size as a float when it declares it', () => {
    expect(LIGHTING_FRAGMENT_SOURCE).toContain('const float TILE_SIZE = 32.0;');
  });
});
