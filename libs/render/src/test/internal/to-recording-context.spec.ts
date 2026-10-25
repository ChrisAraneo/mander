import { describe, expect, it } from 'vitest';

import type { CanvasCall } from '../types/canvas-call';
import { toRecordingContext } from './to-recording-context';

describe('toRecordingContext', () => {
  it('should keep the list of calls it is given when it makes the recording', () => {
    const calls: CanvasCall[] = [];

    const recording = toRecordingContext(calls);

    expect(recording.calls).toBe(calls);
  });

  it('should add the call to the list when something is drawn on the context', () => {
    const calls: CanvasCall[] = [{ name: 'save', args: [] }];

    const recording = toRecordingContext(calls);
    recording.context.arc(1, 2, 3, 0, 4);

    expect(calls).toEqual([
      { name: 'save', args: [] },
      { name: 'arc', args: [1, 2, 3, 0, 4] },
    ]);
  });

  it('should record nothing when nothing is drawn', () => {
    const recording = toRecordingContext([]);

    expect(recording.calls).toEqual([]);
  });
});
