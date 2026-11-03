import type { Random } from '@mander/engine';
import { type Tile, TILE_CANNON } from '@mander/model';
import { pipe } from 'remeda';
import { filterTileCells } from '../structures/filter-tile-cells';
import { patchTiles } from '../structures/patch-tiles';
import { createTripleCannonPatches } from './internal/create-triple-cannon-patches';
import { takeRandomTripleCannonCells } from './internal/take-random-triple-cannon-cells';

export const patchTripleCannons = (tiles: Tile[][], random: Random): Tile[][] =>
  pipe(
    filterTileCells(tiles, TILE_CANNON),
    (cells) => takeRandomTripleCannonCells(cells, random),
    createTripleCannonPatches,
    (patches) => patchTiles(tiles, patches),
  );
