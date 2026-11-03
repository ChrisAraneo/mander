import { describe, expect, it } from 'vitest';

import type { CanvasCall } from '../types/canvas-call';
import { createRecordingGlProxy } from './create-recording-gl-proxy';

describe('createRecordingGlProxy', () => {
  it('should give the name of a constant when a constant is read', () => {
    expect(createRecordingGlProxy([], {}).RG8).toBe('RG8');
  });

  it('should record the call when a method is called', () => {
    const calls: CanvasCall[] = [];
    const program = {} as unknown as WebGLProgram;

    createRecordingGlProxy(calls, {}).linkProgram(program);

    expect(calls).toEqual([{ name: 'linkProgram', args: [program] }]);
  });
});
