import { describe, expect, it } from 'vitest';

import { createRecordingLightingPass } from './create-recording-lighting-pass';

describe('createRecordingLightingPass', () => {
  it('should start with nothing uploaded when the pass is new', () => {
    expect(createRecordingLightingPass().pass.uploaded.tiles).toBeUndefined();
  });

  it('should start with nothing recorded when the pass is new', () => {
    expect(createRecordingLightingPass().calls).toEqual([]);
  });

  it('should report a lost context when it is told to', () => {
    expect(
      createRecordingLightingPass({ isLost: true }).pass.gl.isContextLost(),
    ).toBe(true);
  });
});
