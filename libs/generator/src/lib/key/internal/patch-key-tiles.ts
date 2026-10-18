import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { KeyPatch } from './types/key-patch';

export const patchKeyTiles = ({ tiles, patches }: KeyPatch): Tile[][] =>
  patchTiles(tiles, patches);
