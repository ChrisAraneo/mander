import { tap } from 'lodash-es';
import { pipe } from 'remeda';

export const createLightingShader = (
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader =>
  pipe(
    gl.createShader(type) as WebGLShader,
    (shader) => tap(shader, () => gl.shaderSource(shader, source)),
    (shader) => tap(shader, () => gl.compileShader(shader)),
  );
