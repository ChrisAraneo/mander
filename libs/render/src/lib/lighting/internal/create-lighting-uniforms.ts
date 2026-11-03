import type { LightingUniforms } from '../types/lighting-uniforms';

export const createLightingUniforms = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): LightingUniforms => ({
  tiles: gl.getUniformLocation(program, 'uTiles'),
  levelSize: gl.getUniformLocation(program, 'uLevelSize'),
  origin: gl.getUniformLocation(program, 'uLightOrigin'),
  size: gl.getUniformLocation(program, 'uLightSize'),
  sun: gl.getUniformLocation(program, 'uSun'),
  occluders: gl.getUniformLocation(program, 'uOccluders'),
  occluderCount: gl.getUniformLocation(program, 'uOccluderCount'),
});
