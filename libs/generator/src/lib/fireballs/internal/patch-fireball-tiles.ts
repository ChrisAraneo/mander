import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { FireballPatch } from './types/fireball-patch';

export const patchFireballTiles = ({
  tiles,
  patches,
}: FireballPatch): Tile[][] => patchTiles(tiles, patches);
