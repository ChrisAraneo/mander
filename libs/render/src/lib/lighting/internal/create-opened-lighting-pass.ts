import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import type { LightingPass } from '../types/lighting-pass';
import { createLightingProgram } from './create-lighting-program';
import { createLightingUniforms } from './create-lighting-uniforms';
import { patchLightingDefaults } from './patch-lighting-defaults';

const { nonNullable } = P;

export const createOpenedLightingPass = (
  canvas: HTMLCanvasElement,
  gl: WebGL2RenderingContext,
): LightingPass | undefined =>
  match(createLightingProgram(gl))
    .with(nonNullable, (program) =>
      pipe(
        createLightingUniforms(gl, program),
        (uniforms) =>
          tap(uniforms, () => patchLightingDefaults(gl, program, uniforms)),
        (uniforms): LightingPass => ({
          canvas,
          gl,
          uniforms,
          uploaded: { tiles: undefined },
        }),
      ),
    )
    .otherwise(() => undefined);
