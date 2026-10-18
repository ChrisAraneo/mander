import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { drawClip } from './draw-clip';

describe('drawClip', () => {
  it('should clip to the current path when it is applied to a canvas', () => {
    const calls = drawRecorded(drawClip);

    expect(calls).toEqual(['clip()']);
  });

  it('should hand back the same canvas when it clips', () => {
    const { context } = createRecordingContext();

    const result = drawClip(context);

    expect(result).toBe(context);
  });
});
