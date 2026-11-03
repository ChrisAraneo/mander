import { type CannonKind, type Tile, TILE_CANNON_TRIPLE } from '@mander/model';
import { match } from 'ts-pattern';

export const toCannonKind = (tile: Tile): CannonKind =>
  match(tile)
    .with(TILE_CANNON_TRIPLE, (): CannonKind => 'TRIPLE')
    .otherwise((): CannonKind => 'REGULAR');
