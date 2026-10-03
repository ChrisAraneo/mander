import { SPAWN_HEIGHT, TILE_DIRT, TILE_SPAWN, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPlayerSpawnPatches } from './create-player-spawn-patches';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('createPlayerSpawnPatches', () => {
  it('should mark the rows above the candidate with spawn tiles when there is a candidate', () => {
    expect(
      createPlayerSpawnPatches({
        tiles: LEVEL,
        candidate: { row: 5, column: 2 },
      }).patches,
    ).toEqual([
      { row: 4, column: 2, tile: TILE_SPAWN },
      { row: 3, column: 2, tile: TILE_SPAWN },
    ]);
  });

  it('should make as many marks as the spawn height when there is a candidate', () => {
    expect(
      createPlayerSpawnPatches({
        tiles: LEVEL,
        candidate: { row: 5, column: 2 },
      }).patches,
    ).toHaveLength(SPAWN_HEIGHT);
  });

  it('should make no marks when there is no candidate', () => {
    expect(
      createPlayerSpawnPatches({ tiles: LEVEL, candidate: undefined }).patches,
    ).toEqual([]);
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(
      createPlayerSpawnPatches({ tiles: LEVEL, candidate: undefined }).tiles,
    ).toBe(LEVEL);
  });
});
