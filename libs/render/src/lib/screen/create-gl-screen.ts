import { chain, tapEffect } from '@mander/utils';
import { assign, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { getDeviceSize, getViewportScale, resizeCanvas } from '../viewport';
import { linkProgram } from './link-program';
import type { Screen } from './screen';

const { nullish } = P;

const CONTEXT_OPTIONS: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  preserveDrawingBuffer: false,
};

interface Uniforms {
  scene: WebGLUniformLocation | null;
  resolution: WebGLUniformLocation | null;
  scale: WebGLUniformLocation | null;
}

interface ScreenCell {
  scale: number;
}

const getUniforms = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): Uniforms => ({
  scene: gl.getUniformLocation(program, 'uScene'),
  resolution: gl.getUniformLocation(program, 'uResolution'),
  scale: gl.getUniformLocation(program, 'uScale'),
});

const createTexture = (gl: WebGL2RenderingContext): WebGLTexture | null =>
  chain(gl.createTexture())
    .thru((texture) =>
      tapEffect(texture, () => gl.bindTexture(gl.TEXTURE_2D, texture)),
    )
    .thru((texture) =>
      tapEffect(texture, () =>
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE),
      ),
    )
    .thru((texture) =>
      tapEffect(texture, () =>
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE),
      ),
    )
    .thru((texture) =>
      tapEffect(texture, () =>
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR),
      ),
    )
    .thru((texture) =>
      tapEffect(texture, () =>
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR),
      ),
    )
    .value();

const fitTo = (
  display: HTMLCanvasElement,
  buffer: HTMLCanvasElement,
  cell: ScreenCell,
): void =>
  void chain(getDeviceSize(display))
    .thru((size) => tapEffect(size, () => resizeCanvas(display, size)))
    .thru((size) => tapEffect(size, () => resizeCanvas(buffer, size)))
    .thru(() => assign(cell, { scale: getViewportScale(display) }))
    .value();

const uploadFrame = (
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
  buffer: HTMLCanvasElement,
): void =>
  void chain(texture)
    .thru((current) => tapEffect(current, () => gl.activeTexture(gl.TEXTURE0)))
    .thru((current) => gl.bindTexture(gl.TEXTURE_2D, current))
    .thru(() =>
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        buffer,
      ),
    )
    .value();

const drawFrame = (
  gl: WebGL2RenderingContext,
  display: HTMLCanvasElement,
  uniforms: Uniforms,
  cell: ScreenCell,
): void =>
  void chain(uniforms)
    .thru((current) =>
      tapEffect(current, () =>
        gl.viewport(0, 0, display.width, display.height),
      ),
    )
    .thru((current) => tapEffect(current, () => gl.uniform1i(current.scene, 0)))
    .thru((current) =>
      tapEffect(current, () =>
        gl.uniform2f(current.resolution, display.width, display.height),
      ),
    )
    .thru((current) =>
      tapEffect(current, () => gl.uniform1f(current.scale, cell.scale)),
    )
    .thru(() => gl.drawArrays(gl.TRIANGLES, 0, 3))
    .value();

const releaseContext = (gl: WebGL2RenderingContext): void =>
  match(gl.getExtension('WEBGL_lose_context'))
    .with(nullish, noop)
    .otherwise((extension) => extension.loseContext());

const assemble = (
  display: HTMLCanvasElement,
  gl: WebGL2RenderingContext,
  buffer: CanvasRenderingContext2D,
  program: WebGLProgram,
  texture: WebGLTexture,
): Screen =>
  chain({
    cell: { scale: 1 } as ScreenCell,
    uniforms: getUniforms(gl, program),
  })
    .thru((state): Screen => ({
      buffer,
      fit: () => fitTo(display, buffer.canvas, state.cell),
      present: () =>
        chain(buffer.canvas)
          .thru((frame) => tapEffect(frame, () => gl.useProgram(program)))
          .thru((frame) => uploadFrame(gl, texture, frame))
          .thru(() => drawFrame(gl, display, state.uniforms, state.cell))
          .value(),
      dispose: () =>
        chain(gl)
          .thru((context) =>
            tapEffect(context, () => context.deleteTexture(texture)),
          )
          .thru((context) =>
            tapEffect(context, () => context.deleteProgram(program)),
          )
          .thru((context) => releaseContext(context))
          .value(),
    }))
    .value();

export const createGlScreen = (
  display: HTMLCanvasElement,
  buffer: CanvasRenderingContext2D,
): Screen | null =>
  match(display.getContext('webgl2', CONTEXT_OPTIONS))
    .with(nullish, () => null)
    .otherwise((gl) =>
      chain(gl)
        .thru((context) =>
          tapEffect(context, () =>
            context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true),
          ),
        )
        .thru((context) => ({
          context,
          program: linkProgram(context),
          texture: createTexture(context),
        }))
        .thru(({ context, program, texture }) =>
          match({ program, texture })
            .with({ program: P.nonNullable, texture: P.nonNullable }, (ready) =>
              assemble(display, context, buffer, ready.program, ready.texture),
            )
            .otherwise(() => null),
        )
        .value(),
    );
