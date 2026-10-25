import type { Layers } from '@mander/model';
import { getHeight } from '../get-height';
import type { Pool } from '../types/pool';
import { isCut } from './is-cut';

export const isSketchCut = (
  { tiles, backTiles }: Layers,
  pool: Pool,
): boolean =>
  isCut(tiles, getHeight(pool)) && isCut(backTiles, getHeight(pool));
