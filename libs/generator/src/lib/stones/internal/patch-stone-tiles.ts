import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { StonePatch } from './types/stone-patch';

export const patchStoneTiles = ({ tiles, patches }: StonePatch): Tile[][] =>
  patchTiles(tiles, patches);
