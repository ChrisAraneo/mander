import type { Tile } from '@mander/model';
import { filter } from 'lodash-es';
import type { Spot } from '../types/spot';
import { filterStandingSpots } from './filter-standing-spots';
import { isSurface } from './is-surface';

export const filterStandingSurfaceSpots = (
  tiles: Tile[][],
  clearance: number,
): Spot[] =>
  filter(filterStandingSpots(tiles, clearance), ({ row, column }) =>
    isSurface(tiles, row, column),
  );
