import type { Random } from '@mander/engine';
import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import { patchSandTiles } from './internal/patch-sand-tiles';
import { takeRandomSandableTile } from './internal/take-random-sandable-tile';

export const createSandPatch = (
  tiles: Tile[][],
  random: Random,
): ((layer: Tile[][]) => Tile[][]) =>
  pipe(
    takeRandomSandableTile(tiles, random),
    (sandable) =>
      (layer: Tile[][]): Tile[][] =>
        patchSandTiles(layer, sandable),
  );
