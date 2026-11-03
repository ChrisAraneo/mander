import { size, tap } from 'lodash-es';
import { pipe } from 'remeda';
import type { LightOccluder } from '../types/light-occluder';
import type { LightingPass } from '../types/lighting-pass';
import { createLightOccluderFloats } from './create-light-occluder-floats';

export const patchLightingOccluders = (
  pass: LightingPass,
  occluders: LightOccluder[],
): LightingPass =>
  pipe(
    pass,
    (current) =>
      tap(current, ({ gl, uniforms }) =>
        gl.uniform4fv(uniforms.occluders, createLightOccluderFloats(occluders)),
      ),
    (current) =>
      tap(current, ({ gl, uniforms }) =>
        gl.uniform1i(uniforms.occluderCount, size(occluders)),
      ),
  );
