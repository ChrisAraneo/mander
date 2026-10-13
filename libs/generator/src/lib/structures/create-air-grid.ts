import { type Tile, TILE_AIR } from '@mander/model';
import { times } from 'lodash-es';

export const createAirGrid = (height: number, width: number): Tile[][] =>
  times(height, () => times(width, (): Tile => TILE_AIR));
