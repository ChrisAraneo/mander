import { TILE_SIZE } from '@mander/model';
import { range, floor, ceil } from 'lodash-es';

export const computeVisibleTileRange = (
  camera: number,
  view: number,
  lastIndex: number,
): number[] =>
  range(
    Math.max(0, floor(camera / TILE_SIZE) - 1),
    Math.min(lastIndex, ceil((camera + view) / TILE_SIZE) + 1) + 1,
  );
