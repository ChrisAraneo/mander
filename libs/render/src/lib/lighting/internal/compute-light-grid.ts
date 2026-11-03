import { ceil, floor } from 'lodash-es';
import { pipe } from 'remeda';
import { LIGHT_TEXEL_SIZE } from '../consts';
import type { LightGrid } from '../types/light-grid';
import type { LightingScene } from '../types/lighting-scene';

export const computeLightGrid = ({
  viewport,
  cameraX,
  cameraY,
}: LightingScene): LightGrid =>
  pipe(
    {
      columns: ceil(viewport.width / LIGHT_TEXEL_SIZE) + 1,
      rows: ceil(viewport.height / LIGHT_TEXEL_SIZE) + 1,
    },
    ({ columns, rows }): LightGrid => ({
      x: floor(cameraX / LIGHT_TEXEL_SIZE) * LIGHT_TEXEL_SIZE,
      y: floor(cameraY / LIGHT_TEXEL_SIZE) * LIGHT_TEXEL_SIZE,
      width: columns * LIGHT_TEXEL_SIZE,
      height: rows * LIGHT_TEXEL_SIZE,
      columns,
      rows,
    }),
  );
