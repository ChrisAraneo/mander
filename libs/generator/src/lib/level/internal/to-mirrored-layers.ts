import type { Layers, Tile } from '@mander/model';
import { toMirroredTiles } from '../../structures/to-mirrored-tiles';

export const toMirroredLayers = (
  tiles: Tile[][],
  backTiles: Tile[][],
): Layers => ({
  tiles: toMirroredTiles(tiles),
  backTiles: toMirroredTiles(backTiles),
});
