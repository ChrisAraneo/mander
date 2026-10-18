import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { GemPatch } from './types/gem-patch';

export const patchGemTiles = ({ tiles, patches }: GemPatch): Tile[][] =>
  patchTiles(tiles, patches);
