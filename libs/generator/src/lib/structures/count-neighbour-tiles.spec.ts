import { TILE_DIRT, TILE_STONE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { countNeighbourTiles } from './count-neighbour-tiles';

const createNeighbours = (): (Tile | undefined)[] => [
  TILE_DIRT,
  TILE_STONE,
  undefined,
  TILE_DIRT,
];

describe('countNeighbourTiles', () => {
  it('should count the neighbours that hold the tile when some of them do', () => {
    expect(countNeighbourTiles(createNeighbours(), TILE_DIRT)).toBe(2);
  });

  it('should count the gaps when it is asked for no tile', () => {
    expect(countNeighbourTiles(createNeighbours(), undefined)).toBe(1);
  });

  it('should give zero when no neighbour holds the tile', () => {
    expect(countNeighbourTiles([TILE_STONE], TILE_DIRT)).toBe(0);
  });

  it('should give zero when there are no neighbours', () => {
    expect(countNeighbourTiles([], TILE_DIRT)).toBe(0);
  });

  it('should not change the old neighbours when it counts them', () => {
    const neighbours = createNeighbours();

    countNeighbourTiles(neighbours, TILE_DIRT);

    expect(neighbours).toEqual(createNeighbours());
  });
});
