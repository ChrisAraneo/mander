import { TILE_AIR, TILE_DIRT, TILE_STONE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { stackPaddingRows } from './stack-padding-rows';

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

const SKY: Tile[][] = [[TILE_AIR, TILE_AIR]];

const BEDROCK: Tile[][] = [
  [TILE_STONE, TILE_STONE],
  [TILE_STONE, TILE_STONE],
];

describe('stackPaddingRows', () => {
  it('should put the sky on top and the bedrock at the bottom when it stacks the rows', () => {
    expect(
      stackPaddingRows({ tiles: createLevel(), sky: SKY, bedrock: BEDROCK }),
    ).toEqual([...SKY, ...createLevel(), ...BEDROCK]);
  });

  it('should give back the same grid when there is no sky and no bedrock', () => {
    expect(
      stackPaddingRows({ tiles: createLevel(), sky: [], bedrock: [] }),
    ).toEqual(createLevel());
  });

  it('should give back an empty grid when it gets nothing', () => {
    expect(stackPaddingRows({ tiles: [], sky: [], bedrock: [] })).toEqual([]);
  });

  it('should make new rows for the grid when it stacks the rows', () => {
    const tiles = createLevel();

    expect(stackPaddingRows({ tiles, sky: SKY, bedrock: BEDROCK })[1]).not.toBe(
      tiles[0],
    );
  });
});
