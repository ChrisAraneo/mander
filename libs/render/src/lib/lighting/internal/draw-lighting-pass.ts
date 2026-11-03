import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { patchCanvasSize } from '../../viewport/patch-canvas-size';
import type { LightGrid } from '../types/light-grid';
import type { LightingPass } from '../types/lighting-pass';
import type { LightingScene } from '../types/lighting-scene';
import { patchLightingTiles } from './patch-lighting-tiles';
import { patchLightingUniforms } from './patch-lighting-uniforms';

export const drawLightingPass = (
  pass: LightingPass,
  scene: LightingScene,
  grid: LightGrid,
): LightingPass =>
  pipe(
    pass,
    (current) =>
      tap(current, ({ canvas }) =>
        patchCanvasSize(canvas, { width: grid.columns, height: grid.rows }),
      ),
    (current) => patchLightingTiles(current, scene.state.level),
    (current) => patchLightingUniforms(current, scene, grid),
    (current) =>
      tap(current, ({ canvas, gl }) =>
        gl.viewport(0, 0, canvas.width, canvas.height),
      ),
    (current) => tap(current, ({ gl }) => gl.drawArrays(gl.TRIANGLES, 0, 3)),
  );
