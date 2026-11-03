import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import type { LightingUniforms } from '../types/lighting-uniforms';

export const patchLightingDefaults = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniforms: LightingUniforms,
): WebGL2RenderingContext =>
  pipe(
    gl,
    (target) => tap(target, () => target.useProgram(program)),
    (target) =>
      tap(target, () =>
        target.bindTexture(target.TEXTURE_2D, target.createTexture()),
      ),
    (target) =>
      tap(target, () =>
        target.texParameteri(
          target.TEXTURE_2D,
          target.TEXTURE_MIN_FILTER,
          target.NEAREST,
        ),
      ),
    (target) =>
      tap(target, () =>
        target.texParameteri(
          target.TEXTURE_2D,
          target.TEXTURE_MAG_FILTER,
          target.NEAREST,
        ),
      ),
    (target) =>
      tap(target, () => target.pixelStorei(target.UNPACK_ALIGNMENT, 1)),
    (target) => tap(target, () => target.uniform1i(uniforms.tiles, 0)),
  );
