import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { createActionStep } from './create-action-step';

describe('createActionStep', () => {
  it('should do the action on the canvas when it is applied to a canvas', () => {
    const calls = drawRecorded(createActionStep((context) => context.fill()));

    expect(calls).toEqual(['fill()']);
  });

  it('should hand back the same canvas when the action has run', () => {
    const { context } = createRecordingContext();

    const result = createActionStep((target) => target.stroke())(context);

    expect(result).toBe(context);
  });
});
