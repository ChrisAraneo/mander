import { PLAYER_HEIGHT_TILES } from '@mander/engine';
import { SPAWN_HEIGHT, type Tile } from '@mander/model';
import { ceil } from 'lodash-es';
import { match } from 'ts-pattern';
import { findStandingSpots } from '../../structures/find-standing-spots';
import type { Spot } from '../../types/spot';

const SPAWN_HEADROOM = SPAWN_HEIGHT + ceil(PLAYER_HEIGHT_TILES);

export const findHeadroomSpots = (tiles: Tile[][]): Spot[] =>
  match(findStandingSpots(tiles, SPAWN_HEADROOM))
    .with([], () => findStandingSpots(tiles, SPAWN_HEIGHT))
    .otherwise((spots) => spots);
