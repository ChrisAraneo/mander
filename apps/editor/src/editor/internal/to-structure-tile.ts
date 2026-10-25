import { type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_START, STRUCTURE_END } from '@mander/structures';
import { includes } from 'lodash-es';
import { match } from 'ts-pattern';

const NOT_DRAWN = [STRUCTURE_START, STRUCTURE_END];

export const toStructureTile = (cell: number): Tile =>
  match(includes(NOT_DRAWN, cell))
    .with(true, () => TILE_AIR)
    .otherwise(() => cell);
