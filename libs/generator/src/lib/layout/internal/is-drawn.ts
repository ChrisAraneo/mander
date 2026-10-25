import { type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';

export const isDrawn = (tile: Tile): boolean =>
  tile !== TILE_AIR && tile !== STRUCTURE_START && tile !== STRUCTURE_END;
