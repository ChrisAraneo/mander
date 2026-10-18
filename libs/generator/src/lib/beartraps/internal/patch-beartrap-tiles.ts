import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { BeartrapPatch } from './types/beartrap-patch';

export const patchBeartrapTiles = ({
  tiles,
  patches,
}: BeartrapPatch): Tile[][] => patchTiles(tiles, patches);
