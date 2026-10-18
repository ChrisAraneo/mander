import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { drawRestore } from './draw-restore';

describe('drawRestore', () => {
  it('should bring back the saved canvas state when it is applied to a canvas', () => {
    const calls = drawRecorded(drawRestore);

    expect(calls).toEqual(['restore()']);
  });

  it('should hand back the same canvas when it restores', () => {
    const { context } = createRecordingContext();

    const result = drawRestore(context);

    expect(result).toBe(context);
  });
});
