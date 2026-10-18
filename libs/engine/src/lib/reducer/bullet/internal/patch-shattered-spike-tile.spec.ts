import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { patchShatteredSpikeTile } from './patch-shattered-spike-tile';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const createSpikeLevel = (): GameLevel =>
  createLevel(['.....', '.^.^.', '#####']);

const SPIKE_TILE = { x: 1, y: 1 };

describe('patchShatteredSpikeTile', () => {
  it('should turn the struck spike into air when a spike tile is shattered', () => {
    const level = createSpikeLevel();

    const result = patchShatteredSpikeTile(level, SPIKE_TILE);

    expect(result.tiles).toEqual(
      createLevel(['.....', '...^.', '#####']).tiles,
    );
  });

  it('should keep the rows above and below as they were when a spike tile is shattered', () => {
    const level = createSpikeLevel();

    const result = patchShatteredSpikeTile(level, SPIKE_TILE);

    expect(result.tiles[0]).toBe(level.tiles[0]);
    expect(result.tiles[2]).toBe(level.tiles[2]);
  });

  it('should keep the seed and size of the level when a spike tile is shattered', () => {
    const level = createSpikeLevel();

    const result = patchShatteredSpikeTile(level, SPIKE_TILE);

    expect(result.seed).toBe('SEED');
    expect(result.width).toBe(5);
    expect(result.height).toBe(3);
  });

  it('should keep the chest items of the level when a spike tile is shattered', () => {
    const level = createSpikeLevel();

    const result = patchShatteredSpikeTile(level, SPIKE_TILE);

    expect(result.chestItems).toBe(level.chestItems);
  });

  it('should leave the given level and its rows alone when a spike tile is shattered', () => {
    const level = createSpikeLevel();
    const tiles = level.tiles;
    const spikeRow = level.tiles[1];

    patchShatteredSpikeTile(level, SPIKE_TILE);

    expect(level.tiles).toBe(tiles);
    expect(level.tiles[1]).toBe(spikeRow);
    expect(level.tiles).toEqual(createSpikeLevel().tiles);
  });
});
