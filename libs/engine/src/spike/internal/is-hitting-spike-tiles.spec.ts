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
import { isHittingSpikeTiles } from './is-hitting-spike-tiles';

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

const BARE_LEVEL = createLevel(['.....', '.....', '.....', '#####']);

const BOX_SIZE = 8;

const ON_THE_PRONG_X = 76;

const ON_THE_FLOOR_PRONG_Y = 82;

const ON_THE_CEILING_PRONG_Y = 2;

const IN_THE_OPEN_AIR_Y = 40;

const createBoxAt = (left: number, top: number) => ({
  x: left,
  y: top,
  width: BOX_SIZE,
  height: BOX_SIZE,
});

describe('isHittingSpikeTiles', () => {
  it('should say yes when the box reaches the prong of a floor spike', () => {
    expect(
      isHittingSpikeTiles(
        LEVEL,
        createBoxAt(ON_THE_PRONG_X, ON_THE_FLOOR_PRONG_Y),
      ),
    ).toBe(true);
  });

  it('should say yes when the box reaches the prong of a ceiling spike', () => {
    expect(
      isHittingSpikeTiles(
        LEVEL,
        createBoxAt(ON_THE_PRONG_X, ON_THE_CEILING_PRONG_Y),
      ),
    ).toBe(true);
  });

  it('should say no when the box floats in open air between the spikes', () => {
    expect(
      isHittingSpikeTiles(
        LEVEL,
        createBoxAt(ON_THE_PRONG_X, IN_THE_OPEN_AIR_Y),
      ),
    ).toBe(false);
  });

  it('should say no when the level holds no spike at all', () => {
    expect(
      isHittingSpikeTiles(
        BARE_LEVEL,
        createBoxAt(ON_THE_PRONG_X, ON_THE_FLOOR_PRONG_Y),
      ),
    ).toBe(false);
  });

  it('should leave the level it was handed untouched when it looks for a spike', () => {
    const level = createLevel(LEVEL_ROWS);

    isHittingSpikeTiles(
      level,
      createBoxAt(ON_THE_PRONG_X, ON_THE_FLOOR_PRONG_Y),
    );

    expect(level).toEqual(createLevel(LEVEL_ROWS));
  });
});
