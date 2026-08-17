import { chain, withEffect } from '@mander/utils';
import { match, P } from 'ts-pattern';

import { compileShader } from './compile-shader';
import { FRAGMENT_SOURCE } from './fragment-source';
import { VERTEX_SOURCE } from './vertex-source';

const { nullish } = P;

interface Shaders {
  vertex: WebGLShader;
  fragment: WebGLShader;
}

type MaybeShaders = { [K in keyof Shaders]: Shaders[K] | null };

const discard = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): WebGLProgram | null =>
  chain(program)
    .thru((current) =>
      withEffect(current, () =>
        console.error('screen program failed', gl.getProgramInfoLog(current)),
      ),
    )
    .thru((current) => withEffect(current, () => gl.deleteProgram(current)))
    .thru((): WebGLProgram | null => null)
    .value();

/** The shaders live only inside the linked program, so they go straight after. */
const link = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  shaders: Shaders,
): WebGLProgram | null =>
  chain(program)
    .thru((current) =>
      withEffect(current, () => gl.attachShader(current, shaders.vertex)),
    )
    .thru((current) =>
      withEffect(current, () => gl.attachShader(current, shaders.fragment)),
    )
    .thru((current) => withEffect(current, () => gl.linkProgram(current)))
    .thru((current) =>
      withEffect(current, () => gl.deleteShader(shaders.vertex)),
    )
    .thru((current) =>
      withEffect(current, () => gl.deleteShader(shaders.fragment)),
    )
    .thru((current) =>
      match(gl.getProgramParameter(current, gl.LINK_STATUS))
        .with(true, () => current)
        .otherwise(() => discard(gl, current)),
    )
    .value();

const withShaders = (
  gl: WebGL2RenderingContext,
  shaders: Shaders,
): WebGLProgram | null =>
  match(gl.createProgram())
    .with(nullish, () => null)
    .otherwise((program) => link(gl, program, shaders));

/** Half a pair is no use to anyone; drop whichever side did compile. */
const dropShaders = (
  gl: WebGL2RenderingContext,
  shaders: MaybeShaders,
): WebGLProgram | null =>
  chain(shaders)
    .thru((current) =>
      withEffect(current, () => gl.deleteShader(current.vertex)),
    )
    .thru((current) =>
      withEffect(current, () => gl.deleteShader(current.fragment)),
    )
    .thru((): WebGLProgram | null => null)
    .value();

export const linkProgram = (gl: WebGL2RenderingContext): WebGLProgram | null =>
  match({
    vertex: compileShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE),
    fragment: compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE),
  })
    .with({ vertex: P.nonNullable, fragment: P.nonNullable }, (shaders) =>
      withShaders(gl, shaders),
    )
    .otherwise((shaders) => dropShaders(gl, shaders));
