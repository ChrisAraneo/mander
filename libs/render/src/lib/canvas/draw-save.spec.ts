import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { drawSave } from './draw-save';

describe('drawSave', () => {
  it('should store the canvas state when it is applied to a canvas', () => {
    const calls = drawRecorded(drawSave);

    expect(calls).toEqual(['save()']);
  });

  it('should hand back the same canvas when it saves', () => {
    const { context } = createRecordingContext();

    const result = drawSave(context);

    expect(result).toBe(context);
  });
});
