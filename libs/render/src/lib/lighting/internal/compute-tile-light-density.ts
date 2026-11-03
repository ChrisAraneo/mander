import { isIceTile, isSolidTile, type Tile } from '@mander/model';
import { match } from 'ts-pattern';
import { ICE_TILE_LIGHT_DENSITY, SOLID_TILE_LIGHT_DENSITY } from '../consts';

export const computeTileLightDensity = (tile: Tile): number =>
  match(tile)
    .when(isIceTile, () => ICE_TILE_LIGHT_DENSITY)
    .when(isSolidTile, () => SOLID_TILE_LIGHT_DENSITY)
    .otherwise(() => 0);
