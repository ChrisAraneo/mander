import { PLAYER_HEIGHT_TILES } from '@mander/engine';
import { SPAWN_HEIGHT, type Tile } from '@mander/model';
import { ceil } from 'lodash-es';
import { match } from 'ts-pattern';
import { filterStandingSpots } from '../../structures/filter-standing-spots';
import type { Spot } from '../../types/spot';

const SPAWN_HEADROOM = SPAWN_HEIGHT + ceil(PLAYER_HEIGHT_TILES);

export const filterHeadroomSpots = (tiles: Tile[][]): Spot[] =>
  match(filterStandingSpots(tiles, SPAWN_HEADROOM))
    .with([], () => filterStandingSpots(tiles, SPAWN_HEIGHT))
    .otherwise((spots) => spots);
