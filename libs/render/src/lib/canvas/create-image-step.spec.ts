import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { createImageStep } from './create-image-step';

const IMAGE = { kind: 'IMAGE' } as unknown as CanvasImageSource;

describe('createImageStep', () => {
  it('should draw the image stretched over the given box when the step runs', () => {
    const { context, calls } = createRecordingContext();

    createImageStep(IMAGE, 1, 2, 30, 40)(context);

    expect(calls).toEqual([{ name: 'drawImage', args: [IMAGE, 1, 2, 30, 40] }]);
  });
});
