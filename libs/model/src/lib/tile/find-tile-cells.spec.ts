import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import { TILE_STONE } from '../blocks/tile-stone';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findTileCells } from './find-tile-cells';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

const isBlock = (tile: Tile): boolean =>
  tile === TILE_DIRT || tile === TILE_STONE;

describe('findTileCells', () => {
  it('should return every cell the test accepts when the level holds several of them', () => {
    expect(
      findTileCells(
        createLevel([
          [TILE_DIRT, TILE_AIR, TILE_STONE],
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_DIRT, TILE_AIR],
        ]),
        isBlock,
      ),
    ).toEqual([
      { x: 0, y: 0, tile: TILE_DIRT },
      { x: 2, y: 0, tile: TILE_STONE },
      { x: 1, y: 2, tile: TILE_DIRT },
    ]);
  });

  it('should return the cells in reading order when the test accepts every tile', () => {
    expect(
      findTileCells(
        createLevel([
          [TILE_DIRT, TILE_STONE],
          [TILE_STONE, TILE_DIRT],
        ]),
        isBlock,
      ),
    ).toEqual([
      { x: 0, y: 0, tile: TILE_DIRT },
      { x: 1, y: 0, tile: TILE_STONE },
      { x: 0, y: 1, tile: TILE_STONE },
      { x: 1, y: 1, tile: TILE_DIRT },
    ]);
  });

  it('should return nothing when the test accepts no tile of the level', () => {
    expect(
      findTileCells(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        isBlock,
      ),
    ).toEqual([]);
  });

  it('should return nothing when the level is empty', () => {
    expect(findTileCells(createLevel([]), isBlock)).toEqual([]);
  });

  it('should return only the cells inside the level when tiles lie outside its width and height', () => {
    expect(
      findTileCells(
        {
          seed: 'SEED',
          width: 1,
          height: 1,
          tiles: [
            [TILE_DIRT, TILE_DIRT],
            [TILE_DIRT, TILE_DIRT],
          ],
          chestItems: [],
        },
        isBlock,
      ),
    ).toEqual([{ x: 0, y: 0, tile: TILE_DIRT }]);
  });
});
