import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { isHittingSpikeTile } from './is-hitting-spike-tile';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
  v: TILE_SPIKE_CEILING,
};

const LEVEL_ROWS = ['..v..', '.....', '..^..', '#####'];

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

const LEVEL = createLevel(LEVEL_ROWS);

const BOX_SIZE = 8;

const SPIKE_COLUMN = 2;

const FLOOR_SPIKE_ROW = 2;

const AIR_ROW = 1;

const ON_THE_PRONG_X = 76;

const BESIDE_THE_PRONG_X = 64;

const ON_THE_FLOOR_PRONG_Y = 82;

const BESIDE_THE_PRONG_Y = 66;

const SPIKE_TILE = { x: SPIKE_COLUMN, y: FLOOR_SPIKE_ROW };

const AIR_TILE = { x: SPIKE_COLUMN, y: AIR_ROW };

const createBoxAt = (left: number, top: number) => ({
  x: left,
  y: top,
  width: BOX_SIZE,
  height: BOX_SIZE,
});

describe('isHittingSpikeTile', () => {
  it('should say yes when the box sits on the prong of the spike', () => {
    expect(
      isHittingSpikeTile(
        LEVEL,
        createBoxAt(ON_THE_PRONG_X, ON_THE_FLOOR_PRONG_Y),
        SPIKE_TILE,
      ),
    ).toBe(true);
  });

  it('should say no when the box sits in the spike tile beside its prong', () => {
    expect(
      isHittingSpikeTile(
        LEVEL,
        createBoxAt(BESIDE_THE_PRONG_X, BESIDE_THE_PRONG_Y),
        SPIKE_TILE,
      ),
    ).toBe(false);
  });

  it('should say no when the tile holds no spike', () => {
    expect(
      isHittingSpikeTile(
        LEVEL,
        createBoxAt(ON_THE_PRONG_X, ON_THE_FLOOR_PRONG_Y),
        AIR_TILE,
      ),
    ).toBe(false);
  });

  it('should leave the level it was handed untouched when it looks at the tile', () => {
    const level = createLevel(LEVEL_ROWS);

    isHittingSpikeTile(
      level,
      createBoxAt(ON_THE_PRONG_X, ON_THE_FLOOR_PRONG_Y),
      SPIKE_TILE,
    );

    expect(level).toEqual(createLevel(LEVEL_ROWS));
  });
});
