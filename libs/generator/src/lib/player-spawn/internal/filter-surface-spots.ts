import { SPAWN_HEIGHT, type Tile } from '@mander/model';
import { filterStandingSurfaceSpots } from '../../structures/filter-standing-surface-spots';
import type { Spot } from '../../types/spot';

export const filterSurfaceSpots = (tiles: Tile[][]): Spot[] =>
  filterStandingSurfaceSpots(tiles, SPAWN_HEIGHT);
