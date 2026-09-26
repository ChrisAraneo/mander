import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createBedrockRows } from './create-bedrock-rows';

const FLOOR: Tile[] = [TILE_DIRT, TILE_AIR, TILE_DIRT];

const LEVEL: Tile[][] = [[TILE_AIR, TILE_AIR, TILE_AIR], FLOOR];

const SKY: Tile[][] = [[TILE_AIR, TILE_AIR, TILE_AIR]];

const PADDING = { sky: 1, depth: 3 };

describe('createBedrockRows', () => {
  it('should copy the floor as many times as the depth when there is a floor', () => {
    expect(
      createBedrockRows({
        tiles: LEVEL,
        padding: PADDING,
        floor: FLOOR,
        sky: SKY,
      }).bedrock,
    ).toEqual([FLOOR, FLOOR, FLOOR]);
  });

  it('should make new rows when it copies the floor', () => {
    const { bedrock } = createBedrockRows({
      tiles: LEVEL,
      padding: PADDING,
      floor: FLOOR,
      sky: SKY,
    });

    expect(bedrock[0]).not.toBe(FLOOR);
    expect(bedrock[0]).not.toBe(bedrock[1]);
  });

  it('should make no rows when the depth is zero', () => {
    expect(
      createBedrockRows({
        tiles: LEVEL,
        padding: { sky: 1, depth: 0 },
        floor: FLOOR,
        sky: SKY,
      }).bedrock,
    ).toEqual([]);
  });

  it('should make no rows when there is no floor', () => {
    expect(
      createBedrockRows({
        tiles: [],
        padding: PADDING,
        floor: undefined,
        sky: [],
      }).bedrock,
    ).toEqual([]);
  });

  it('should keep the grid and the sky the same when it makes the bedrock', () => {
    const { tiles, sky } = createBedrockRows({
      tiles: LEVEL,
      padding: PADDING,
      floor: FLOOR,
      sky: SKY,
    });

    expect(tiles).toBe(LEVEL);
    expect(sky).toBe(SKY);
  });
});
