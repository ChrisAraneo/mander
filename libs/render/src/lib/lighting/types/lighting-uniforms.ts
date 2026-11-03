export interface LightingUniforms {
  tiles: WebGLUniformLocation | null;
  levelSize: WebGLUniformLocation | null;
  origin: WebGLUniformLocation | null;
  size: WebGLUniformLocation | null;
  sun: WebGLUniformLocation | null;
  occluders: WebGLUniformLocation | null;
  occluderCount: WebGLUniformLocation | null;
}
