import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { ChestPatch } from './types/chest-patch';

export const patchChestTiles = ({ tiles, patches }: ChestPatch): Tile[][] =>
  patchTiles(tiles, patches);
