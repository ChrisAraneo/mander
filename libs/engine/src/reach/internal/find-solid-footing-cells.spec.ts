import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { createStandingPlayer } from './create-standing-player';
import { findSolidFootingCells } from './find-solid-footing-cells';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
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

const STRADDLING_TWO_TILES_X = 50;

const AT_THE_HOLE_EDGE_X = 80;

const OVER_THE_HOLE_X = 100;

const STANDING_Y = 16;

const LEVEL = createLevel(['.....', '.....', '###.#']);

const LEFT_FOOT_CELL = 11;

const RIGHT_FOOT_CELL = 12;

describe('findSolidFootingCells', () => {
  it('should give both cells under the feet when the player stands on two tiles', () => {
    const cells = findSolidFootingCells(
      LEVEL,
      createStandingPlayer(STRADDLING_TWO_TILES_X, STANDING_Y),
    );

    expect(cells).toEqual([LEFT_FOOT_CELL, RIGHT_FOOT_CELL]);
  });

  it('should leave out the hole when the player stands at its edge', () => {
    const cells = findSolidFootingCells(
      LEVEL,
      createStandingPlayer(AT_THE_HOLE_EDGE_X, STANDING_Y),
    );

    expect(cells).toEqual([RIGHT_FOOT_CELL]);
  });

  it('should give no cells when nothing solid is under the feet', () => {
    const cells = findSolidFootingCells(
      LEVEL,
      createStandingPlayer(OVER_THE_HOLE_X, STANDING_Y),
    );

    expect(cells).toEqual([]);
  });

  it('should leave the player it was handed untouched when it looks underfoot', () => {
    const player = createStandingPlayer(STRADDLING_TWO_TILES_X, STANDING_Y);

    findSolidFootingCells(LEVEL, player);

    expect(player).toEqual(
      createStandingPlayer(STRADDLING_TWO_TILES_X, STANDING_Y),
    );
  });
});
