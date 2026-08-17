/**
 * A full-screen triangle built straight out of the vertex id, so the screen
 * stage needs no buffers or attributes at all.
 */
export const VERTEX_SOURCE = `#version 300 es

void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));

  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}
`;
