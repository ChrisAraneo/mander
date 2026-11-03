import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { SUN_X, SUN_Y } from '../../sun/consts';
import type { LightGrid } from '../types/light-grid';
import type { LightingPass } from '../types/lighting-pass';
import type { LightingScene } from '../types/lighting-scene';
import { findLightOccluders } from './find-light-occluders';
import { patchLightingOccluders } from './patch-lighting-occluders';

export const patchLightingUniforms = (
  pass: LightingPass,
  scene: LightingScene,
  grid: LightGrid,
): LightingPass =>
  pipe(
    pass,
    (current) =>
      tap(current, ({ gl, uniforms }) =>
        gl.uniform2f(uniforms.origin, grid.x, grid.y),
      ),
    (current) =>
      tap(current, ({ gl, uniforms }) =>
        gl.uniform2f(uniforms.size, grid.width, grid.height),
      ),
    (current) =>
      tap(current, ({ gl, uniforms }) =>
        gl.uniform2f(
          uniforms.sun,
          SUN_X + scene.cameraX - grid.x,
          SUN_Y + scene.cameraY - grid.y,
        ),
      ),
    (current) => patchLightingOccluders(current, findLightOccluders(scene)),
  );
