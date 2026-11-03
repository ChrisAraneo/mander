import { describe, expect, it } from 'vitest';

import { createRecordingGl } from '../../test/create-recording-gl';
import { closeLightingPass } from './close-lighting-pass';
import type { LightingPass } from './types/lighting-pass';

const createPass = (gl: WebGL2RenderingContext): LightingPass =>
  ({ gl }) as unknown as LightingPass;

describe('closeLightingPass', () => {
  it('should let go of the context when the browser offers the extension', () => {
    const { gl, calls } = createRecordingGl();

    closeLightingPass(createPass(gl));

    expect(calls).toEqual([{ name: 'loseContext', args: [] }]);
  });

  it('should do nothing when the browser does not offer the extension', () => {
    const { gl, calls } = createRecordingGl({ hasLoseContext: false });

    closeLightingPass(createPass(gl));

    expect(calls).toEqual([]);
  });
});
