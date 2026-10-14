import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { SpikePatch } from './types/spike-patch';

export const patchSpikeTiles = ({ tiles, patches }: SpikePatch): Tile[][] =>
  patchTiles(tiles, patches);
