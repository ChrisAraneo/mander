import { assign } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { CanvasCall } from '../types/canvas-call';
import { createRecordingProxy } from './create-recording-proxy';

describe('createRecordingProxy', () => {
  it('should write the call into the list when something is drawn on it', () => {
    const calls: CanvasCall[] = [];

    createRecordingProxy(calls).fillRect(1, 2, 3, 4);

    expect(calls).toEqual([{ name: 'fillRect', args: [1, 2, 3, 4] }]);
  });

  it('should write the style into the list when a style is set on it', () => {
    const calls: CanvasCall[] = [];

    assign(createRecordingProxy(calls), { lineWidth: 2 });

    expect(calls).toEqual([{ name: 'set lineWidth', args: [2] }]);
  });

  it('should write the gradient and its stops into the list when a gradient is made on it', () => {
    const calls: CanvasCall[] = [];

    createRecordingProxy(calls)
      .createLinearGradient(0, 0, 1, 1)
      .addColorStop(0, '#000');

    expect(calls).toEqual([
      { name: 'createLinearGradient', args: [0, 0, 1, 1] },
      { name: 'addColorStop', args: [0, '#000'] },
    ]);
  });

  it('should keep the list empty when nothing is drawn on it', () => {
    const calls: CanvasCall[] = [];

    createRecordingProxy(calls);

    expect(calls).toEqual([]);
  });
});
