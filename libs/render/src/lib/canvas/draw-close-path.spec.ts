import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { drawClosePath } from './draw-close-path';

describe('drawClosePath', () => {
  it('should close the current path when it is applied to a canvas', () => {
    const calls = drawRecorded(drawClosePath);

    expect(calls).toEqual(['closePath()']);
  });

  it('should hand back the same canvas when it closes a path', () => {
    const { context } = createRecordingContext();

    const result = drawClosePath(context);

    expect(result).toBe(context);
  });
});
