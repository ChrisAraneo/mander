import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { createStyleStep } from './create-style-step';

describe('createStyleStep', () => {
  it('should set every style in order when it is given several', () => {
    const calls = drawRecorded(
      createStyleStep({ fillStyle: '#123456', lineWidth: 3 }),
    );

    expect(calls).toEqual(['set fillStyle(#123456)', 'set lineWidth(3)']);
  });

  it('should set nothing when it is given no style', () => {
    const calls = drawRecorded(createStyleStep({}));

    expect(calls).toEqual([]);
  });

  it('should hand back the same canvas when it sets a style', () => {
    const { context } = createRecordingContext();

    const result = createStyleStep({ lineWidth: 1 })(context);

    expect(result).toBe(context);
  });
});
