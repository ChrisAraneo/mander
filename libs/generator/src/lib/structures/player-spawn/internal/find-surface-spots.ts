import { SPAWN_HEIGHT, type Tile } from '@mander/model';
import { filter } from 'lodash-es';
import { findStandingSpots } from '../../find-standing-spots';
import { isSurface } from '../../is-surface';

export const findSurfaceSpots = (tiles: Tile[][]) =>
  filter(findStandingSpots(tiles, SPAWN_HEIGHT), ({ row, column }) =>
    isSurface(tiles, row, column),
  );
