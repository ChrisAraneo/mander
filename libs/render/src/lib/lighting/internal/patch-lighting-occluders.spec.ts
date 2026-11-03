import { describe, expect, it } from 'vitest';

import { createRecordingLightingPass } from '../../../test/create-recording-lighting-pass';
import { createLightOccluderFloats } from './create-light-occluder-floats';
import { patchLightingOccluders } from './patch-lighting-occluders';

const OCCLUDERS = [{ x: 1, y: 2, width: 3, height: 4 }];

describe('patchLightingOccluders', () => {
  it('should send the boxes and how many there are when it is given occluders', () => {
    const { pass, calls } = createRecordingLightingPass();

    patchLightingOccluders(pass, OCCLUDERS);

    expect(calls).toEqual([
      {
        name: 'uniform4fv',
        args: ['location:uOccluders', createLightOccluderFloats(OCCLUDERS)],
      },
      { name: 'uniform1i', args: ['location:uOccluderCount', 1] },
    ]);
  });

  it('should send a count of nothing when there are no occluders', () => {
    const { pass, calls } = createRecordingLightingPass();

    patchLightingOccluders(pass, []);

    expect(calls[1]).toEqual({
      name: 'uniform1i',
      args: ['location:uOccluderCount', 0],
    });
  });
});
