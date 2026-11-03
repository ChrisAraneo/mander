import type { Level } from '@mander/model';
import { assign, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { LightingPass } from '../types/lighting-pass';
import { createTileLightBytes } from './create-tile-light-bytes';

export const patchLightingTiles = (
  pass: LightingPass,
  level: Level,
): LightingPass =>
  match(pass.uploaded.tiles === level.tiles)
    .with(true, () => pass)
    .otherwise(() =>
      pipe(
        pass,
        (current) =>
          tap(current, ({ gl }) =>
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RG8,
              level.width,
              level.height,
              0,
              gl.RG,
              gl.UNSIGNED_BYTE,
              createTileLightBytes(level),
            ),
          ),
        (current) =>
          tap(current, ({ gl, uniforms }) =>
            gl.uniform2f(uniforms.levelSize, level.width, level.height),
          ),
        (current) =>
          tap(current, ({ uploaded }) =>
            assign(uploaded, { tiles: level.tiles }),
          ),
      ),
    );
