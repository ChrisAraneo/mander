import type { Random } from '@mander/common';
import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import { createTripleCannonPatches } from './internal/create-triple-cannon-patches';
import { filterTripleCannonCells } from './internal/filter-triple-cannon-cells';
import { patchCannonTiles } from './internal/patch-cannon-tiles';
import { takeRandomTripleCannonCells } from './internal/take-random-triple-cannon-cells';

export const patchTripleCannons = (tiles: Tile[][], random: Random): Tile[][] =>
  pipe(
    { tiles, random },
    filterTripleCannonCells,
    takeRandomTripleCannonCells,
    createTripleCannonPatches,
    patchCannonTiles,
  );
