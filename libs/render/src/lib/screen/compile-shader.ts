import { chain, tapEffect } from '@mander/utils';
import { match, P } from 'ts-pattern';

const { nullish } = P;

const discard = (
  gl: WebGL2RenderingContext,
  shader: WebGLShader,
): WebGLShader | null =>
  chain(shader)
    .thru((current) =>
      tapEffect(current, () =>
        console.error('screen shader failed', gl.getShaderInfoLog(current)),
      ),
    )
    .thru((current) => tapEffect(current, () => gl.deleteShader(current)))
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
          tapEffect(current, () => gl.shaderSource(current, source)),
        )
        .thru((current) => tapEffect(current, () => gl.compileShader(current)))
        .thru((current) =>
          match(gl.getShaderParameter(current, gl.COMPILE_STATUS))
            .with(true, () => current)
            .otherwise(() => discard(gl, current)),
        )
        .value(),
    );
