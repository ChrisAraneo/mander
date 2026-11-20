import type { Random } from '@mander/common';
import type { Tile } from '@mander/model';
import type { LayerPatch } from '../types/layer-patch';
import { patchSandTiles } from './internal/patch-sand-tiles';
import { takeRandomSandableTile } from './internal/take-random-sandable-tile';

const toSandPatch =
  (sandable: Tile | undefined): LayerPatch =>
  (layer: Tile[][]): Tile[][] =>
    patchSandTiles(layer, sandable);

export const createSandPatch = (tiles: Tile[][], random: Random): LayerPatch =>
  toSandPatch(takeRandomSandableTile(tiles, random));
