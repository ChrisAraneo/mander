import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { findStruckBoxTile } from './find-struck-box-tile';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '.^...', '#####']);

const SPIKE_COLUMN = 1;

const SPIKE_ROW = 2;

const BOX_SIZE = 8;

const IN_THE_PRONGS_X = 41;

const IN_THE_PRONGS_Y = 81;

const ABOVE_THE_PRONGS_Y = 64;

const FAR_FROM_THE_SPIKE_X = 121;

const FAR_FROM_THE_SPIKE_Y = 21;

const createBoxAt = (left: number, top: number) => ({
  x: left,
  y: top,
  width: BOX_SIZE,
  height: BOX_SIZE,
});

describe('findStruckBoxTile', () => {
  it('should give the column and row of the spike when the box reaches into its prongs', () => {
    const tile = findStruckBoxTile(
      LEVEL,
      createBoxAt(IN_THE_PRONGS_X, IN_THE_PRONGS_Y),
    );

    expect(tile).toEqual({ x: SPIKE_COLUMN, y: SPIKE_ROW });
  });

  it('should find no spike when the box sits above the prongs', () => {
    const tile = findStruckBoxTile(
      LEVEL,
      createBoxAt(IN_THE_PRONGS_X, ABOVE_THE_PRONGS_Y),
    );

    expect(tile).toBeUndefined();
  });

  it('should find no spike when no spike stands near the box', () => {
    const tile = findStruckBoxTile(
      LEVEL,
      createBoxAt(FAR_FROM_THE_SPIKE_X, FAR_FROM_THE_SPIKE_Y),
    );

    expect(tile).toBeUndefined();
  });

  it('should leave the level it was handed untouched when it looks for a spike', () => {
    const level = createLevel(['.....', '.....', '.^...', '#####']);

    findStruckBoxTile(level, createBoxAt(IN_THE_PRONGS_X, IN_THE_PRONGS_Y));

    expect(level).toEqual(createLevel(['.....', '.....', '.^...', '#####']));
  });
});
