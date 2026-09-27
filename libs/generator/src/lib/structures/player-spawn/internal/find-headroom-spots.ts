import { PLAYER_HEIGHT_TILES } from '@mander/engine';
import { SPAWN_HEIGHT, type Tile } from '@mander/model';
import { ceil } from 'lodash-es';
import { match } from 'ts-pattern';
import { findStandingSpots } from '../../find-standing-spots';

const SPAWN_HEADROOM = SPAWN_HEIGHT + ceil(PLAYER_HEIGHT_TILES);

export const findHeadroomSpots = (tiles: Tile[][]) =>
  match(findStandingSpots(tiles, SPAWN_HEADROOM))
    .with([], () => findStandingSpots(tiles, SPAWN_HEIGHT))
    .otherwise((spots) => spots);
