import { describe, expect, it } from 'vitest';

import type { CanvasCall } from '../types/canvas-call';
import { createRecordedGradient } from './create-recorded-gradient';

describe('createRecordedGradient', () => {
  it('should record the gradient and then each colour stop when stops are added', () => {
    const calls: CanvasCall[] = [];

    createRecordedGradient(
      calls,
      'createLinearGradient',
      [0, 1, 2, 3],
    ).addColorStop(0.5, '#000');

    expect(calls).toEqual([
      { name: 'createLinearGradient', args: [0, 1, 2, 3] },
      { name: 'addColorStop', args: [0.5, '#000'] },
    ]);
  });
});
