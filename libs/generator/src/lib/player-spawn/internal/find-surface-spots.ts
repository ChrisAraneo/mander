import { SPAWN_HEIGHT, type Tile } from '@mander/model';
import { filter } from 'lodash-es';
import { findStandingSpots } from '../../structures/find-standing-spots';
import { isSurface } from '../../structures/is-surface';
import type { Spot } from '../../types/spot';

export const findSurfaceSpots = (tiles: Tile[][]): Spot[] =>
  filter(findStandingSpots(tiles, SPAWN_HEIGHT), ({ row, column }) =>
    isSurface(tiles, row, column),
  );
