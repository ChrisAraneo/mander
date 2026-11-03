import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { createLightingShader } from './create-lighting-shader';
import { LIGHTING_FRAGMENT_SOURCE } from './lighting-fragment-source';
import { LIGHTING_VERTEX_SOURCE } from './lighting-vertex-source';

export const createLightingProgram = (
  gl: WebGL2RenderingContext,
): WebGLProgram | undefined =>
  pipe(
    gl.createProgram() as WebGLProgram,
    (program) =>
      tap(program, () =>
        gl.attachShader(
          program,
          createLightingShader(gl, gl.VERTEX_SHADER, LIGHTING_VERTEX_SOURCE),
        ),
      ),
    (program) =>
      tap(program, () =>
        gl.attachShader(
          program,
          createLightingShader(
            gl,
            gl.FRAGMENT_SHADER,
            LIGHTING_FRAGMENT_SOURCE,
          ),
        ),
      ),
    (program) => tap(program, () => gl.linkProgram(program)),
    (program) =>
      match(Boolean(gl.getProgramParameter(program, gl.LINK_STATUS)))
        .with(true, () => program)
        .otherwise(() => undefined),
  );
