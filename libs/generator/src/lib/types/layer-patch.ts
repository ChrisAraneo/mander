import type { Tile } from '@mander/model';

export type LayerPatch = (layer: Tile[][]) => Tile[][];
