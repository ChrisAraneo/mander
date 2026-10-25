import type { Tile } from '@mander/model';
import { filter, size } from 'lodash-es';

export const countNeighbourTiles = (
  neighbours: (Tile | undefined)[],
  tile: Tile | undefined,
): number => size(filter(neighbours, (other) => other === tile));
