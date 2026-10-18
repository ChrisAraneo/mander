import { assign } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRecordingContext } from './create-recording-context';

describe('createRecordingContext', () => {
  it('should record the call when something is drawn on the context', () => {
    const recording = createRecordingContext();

    recording.context.arc(1, 2, 3, 0, 4);

    expect(recording.calls).toEqual([{ name: 'arc', args: [1, 2, 3, 0, 4] }]);
  });

  it('should record the style when a property of the context is set', () => {
    const recording = createRecordingContext();

    assign(recording.context, { fillStyle: '#FFF' });

    expect(recording.calls).toEqual([
      { name: 'set fillStyle', args: ['#FFF'] },
    ]);
  });

  it('should record the gradient and its stops when a gradient is made on the context', () => {
    const recording = createRecordingContext();

    recording.context
      .createRadialGradient(0, 0, 1, 0, 0, 2)
      .addColorStop(1, '#FFF');

    expect(recording.calls).toEqual([
      { name: 'createRadialGradient', args: [0, 0, 1, 0, 0, 2] },
      { name: 'addColorStop', args: [1, '#FFF'] },
    ]);
  });

  it('should record nothing when nothing is drawn', () => {
    const recording = createRecordingContext();

    expect(recording.calls).toEqual([]);
  });
});
