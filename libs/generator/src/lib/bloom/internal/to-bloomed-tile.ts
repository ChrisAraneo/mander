import { type Tile, TILE_FIREBALL, TILE_PINKBALL } from '@mander/model';
import { match } from 'ts-pattern';

export const toBloomedTile = (tile: Tile): Tile =>
  match(tile)
    .with(TILE_FIREBALL, () => TILE_PINKBALL)
    .otherwise(() => tile);
