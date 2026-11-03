import { describe, expect, it } from 'vitest';

import type { CanvasCall } from '../types/canvas-call';
import { toRecordingGlMember } from './to-recording-gl-member';

describe('toRecordingGlMember', () => {
  it('should record the name and the arguments when the member is an ordinary call', () => {
    const calls: CanvasCall[] = [];

    toRecordingGlMember(calls, 'uniform1i', {})('location', 2);

    expect(calls).toEqual([{ name: 'uniform1i', args: ['location', 2] }]);
  });

  it('should name the shader by its type when a shader is created', () => {
    expect(toRecordingGlMember([], 'createShader', {})('FRAGMENT')).toBe(
      'shader:FRAGMENT',
    );
  });

  it('should give a program when a program is created', () => {
    expect(toRecordingGlMember([], 'createProgram', {})()).toBe('program');
  });

  it('should give a texture when a texture is created', () => {
    expect(toRecordingGlMember([], 'createTexture', {})()).toBe('texture');
  });
});
