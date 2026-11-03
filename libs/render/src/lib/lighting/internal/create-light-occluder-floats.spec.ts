import { describe, expect, it } from 'vitest';

import { MAX_LIGHT_OCCLUDERS } from '../consts';
import { createLightOccluderFloats } from './create-light-occluder-floats';

describe('createLightOccluderFloats', () => {
  it('should fill the whole array when there are no occluders so the shader can always read it', () => {
    expect(createLightOccluderFloats([])).toEqual(
      new Float32Array(MAX_LIGHT_OCCLUDERS * 4),
    );
  });

  it('should put each box first and pad the rest with nothing when there are occluders', () => {
    const floats = createLightOccluderFloats([
      { x: 1, y: 2, width: 3, height: 4 },
    ]);

    expect([...floats.slice(0, 5)]).toEqual([1, 2, 3, 4, 0]);
    expect(floats.length).toBe(MAX_LIGHT_OCCLUDERS * 4);
  });
});
