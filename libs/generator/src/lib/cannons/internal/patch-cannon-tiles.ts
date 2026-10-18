import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { CannonPatch } from './types/cannon-patch';

export const patchCannonTiles = ({ tiles, patches }: CannonPatch): Tile[][] =>
  patchTiles(tiles, patches);
