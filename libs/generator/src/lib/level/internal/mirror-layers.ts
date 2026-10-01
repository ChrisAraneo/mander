import type { Layers, Tile } from '@mander/model';
import { mirrorTiles } from '../../structures/mirror-tiles';

export const mirrorLayers = (tiles: Tile[][], backTiles: Tile[][]): Layers => ({
  tiles: mirrorTiles(tiles),
  backTiles: mirrorTiles(backTiles),
});
