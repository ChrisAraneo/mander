import { describe, expect, it } from 'vitest';

import { createRecordingGl } from './create-recording-gl';

describe('createRecordingGl', () => {
  it('should record the call when something is asked of the context', () => {
    const { gl, calls } = createRecordingGl();

    gl.viewport(0, 0, 4, 2);

    expect(calls).toEqual([{ name: 'viewport', args: [0, 0, 4, 2] }]);
  });

  it('should give the name of a constant when a constant is read', () => {
    expect(createRecordingGl().gl.TEXTURE_2D).toBe('TEXTURE_2D');
  });

  it('should report a linked program when it is not told otherwise', () => {
    const { gl } = createRecordingGl();

    expect(gl.getProgramParameter({}, gl.LINK_STATUS)).toBe(true);
  });

  it('should report a failed link when it is told to', () => {
    const { gl } = createRecordingGl({ isLinked: false });

    expect(gl.getProgramParameter({}, gl.LINK_STATUS)).toBe(false);
  });

  it('should report a lost context when it is told to', () => {
    expect(createRecordingGl({ isLost: true }).gl.isContextLost()).toBe(true);
  });

  it('should name the renderer it is told to when the renderer is read', () => {
    const { gl } = createRecordingGl({ renderer: 'SwiftShader' });

    expect(gl.getParameter(gl.RENDERER)).toBe('SwiftShader');
  });

  it('should name the uniform when a location is asked for', () => {
    expect(createRecordingGl().gl.getUniformLocation({}, 'uSun')).toBe(
      'location:uSun',
    );
  });

  it('should record the context being let go when the extension is asked to', () => {
    const { gl, calls } = createRecordingGl();

    gl.getExtension('WEBGL_lose_context')?.loseContext();

    expect(calls).toEqual([{ name: 'loseContext', args: [] }]);
  });

  it('should have no extension when it is told to go without', () => {
    expect(
      createRecordingGl({ hasLoseContext: false }).gl.getExtension(
        'WEBGL_lose_context',
      ),
    ).toBeNull();
  });
});
