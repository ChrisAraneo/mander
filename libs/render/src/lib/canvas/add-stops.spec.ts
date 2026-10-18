import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { addStops } from './add-stops';

describe('addStops', () => {
  it('should add every colour stop in order when it is given stops', () => {
    const calls = drawRecorded((context) =>
      addStops([
        [0, '#000'],
        [1, '#FFF'],
      ])(context.createLinearGradient(0, 0, 1, 1)),
    );

    expect(calls).toEqual([
      'createLinearGradient(0, 0, 1, 1)',
      'addColorStop(0, #000)',
      'addColorStop(1, #FFF)',
    ]);
  });

  it('should add nothing when it is given no stops', () => {
    const calls = drawRecorded((context) =>
      addStops([])(context.createLinearGradient(0, 0, 1, 1)),
    );

    expect(calls).toEqual(['createLinearGradient(0, 0, 1, 1)']);
  });

  it('should hand back the same gradient when it adds stops', () => {
    const gradient = createRecordingContext().context.createLinearGradient(
      0,
      0,
      1,
      1,
    );

    const result = addStops([[0, '#000']])(gradient);

    expect(result).toBe(gradient);
  });
});
