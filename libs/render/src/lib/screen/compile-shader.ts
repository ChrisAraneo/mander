import { chain, withEffect } from '@mander/utils';
import { match, P } from 'ts-pattern';

const { nullish } = P;

const discard = (
  gl: WebGL2RenderingContext,
  shader: WebGLShader,
): WebGLShader | null =>
  chain(shader)
    .thru((current) =>
      withEffect(current, () =>
        console.error('screen shader failed', gl.getShaderInfoLog(current)),
      ),
    )
    .thru((current) => withEffect(current, () => gl.deleteShader(current)))
    .thru((): WebGLShader | null => null)
    .value();

export const compileShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null =>
  match(gl.createShader(type))
    .with(nullish, () => null)
    .otherwise((shader) =>
      chain(shader)
        .thru((current) =>
          withEffect(current, () => gl.shaderSource(current, source)),
        )
        .thru((current) => withEffect(current, () => gl.compileShader(current)))
        .thru((current) =>
          match(gl.getShaderParameter(current, gl.COMPILE_STATUS))
            .with(true, () => current)
            .otherwise(() => discard(gl, current)),
        )
        .value(),
    );
