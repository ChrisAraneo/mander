import { type Level, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { filter } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRecordingLightingPass } from '../../../test/create-recording-lighting-pass';
import { createTileLightBytes } from './create-tile-light-bytes';
import { patchLightingTiles } from './patch-lighting-tiles';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: 2,
  height: 1,
  tiles,
  chestItems: [],
});

const LEVEL = createLevel([[TILE_AIR, TILE_DIRT]]);

describe('patchLightingTiles', () => {
  it('should upload the tiles and the level size when the level is new', () => {
    const { pass, calls } = createRecordingLightingPass();

    patchLightingTiles(pass, LEVEL);

    expect(calls).toEqual([
      {
        name: 'texImage2D',
        args: [
          'TEXTURE_2D',
          0,
          'RG8',
          2,
          1,
          0,
          'RG',
          'UNSIGNED_BYTE',
          createTileLightBytes(LEVEL),
        ],
      },
      { name: 'uniform2f', args: ['location:uLevelSize', 2, 1] },
    ]);
  });

  it('should not upload again when the tiles have not changed', () => {
    const { pass, calls } = createRecordingLightingPass();

    patchLightingTiles(pass, LEVEL);
    patchLightingTiles(pass, { ...LEVEL });

    expect(filter(calls, { name: 'texImage2D' })).toHaveLength(1);
  });

  it('should upload again when a tile of the level has changed', () => {
    const { pass, calls } = createRecordingLightingPass();

    patchLightingTiles(pass, LEVEL);
    patchLightingTiles(pass, createLevel([[TILE_AIR, TILE_AIR]]));

    expect(filter(calls, { name: 'texImage2D' })).toHaveLength(2);
  });
});
