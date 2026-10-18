import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { drawBeginPath } from './draw-begin-path';

describe('drawBeginPath', () => {
  it('should start a new path when it is applied to a canvas', () => {
    const calls = drawRecorded(drawBeginPath);

    expect(calls).toEqual(['beginPath()']);
  });

  it('should hand back the same canvas when it starts a path', () => {
    const { context } = createRecordingContext();

    const result = drawBeginPath(context);

    expect(result).toBe(context);
  });
});
