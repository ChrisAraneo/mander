import { match } from 'ts-pattern';
import { createOpenedLightingPass } from './internal/create-opened-lighting-pass';
import { isSoftwareRenderer } from './internal/is-software-renderer';
import type { LightingPass } from './types/lighting-pass';

export const createLightingPass = (
  canvas: HTMLCanvasElement,
): LightingPass | undefined =>
  match(
    canvas.getContext('webgl2', {
      antialias: false,
      depth: false,
      stencil: false,
      failIfMajorPerformanceCaveat: true,
    }),
  )
    .when(
      (gl): gl is WebGL2RenderingContext =>
        gl !== null && !isSoftwareRenderer(gl),
      (gl) => createOpenedLightingPass(canvas, gl),
    )
    .otherwise(() => undefined);
