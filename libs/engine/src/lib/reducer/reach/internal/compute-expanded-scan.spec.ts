import { type Player, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { every, head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { computeExpandedScan } from './compute-expanded-scan';
import { computeStateCells } from './compute-state-cells';
import { createStandingPlayer } from './create-standing-player';
import { hashPlayerNode } from './hash-player-node';
import type { Scan } from './types/scan';

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
});

const createStartScan = (level: GameLevel, player: Player): Scan => ({
  visited: new Set([hashPlayerNode(player)]),
  cells: new Set(computeStateCells(level, player)),
  frontier: [player],
});

const SINGLE_TILE = createLevel(['.', '.', '.', '#']);

const FLAT_FLOOR = createLevel([
  '........',
  '........',
  '........',
  '########',
]);

describe('computeExpandedScan', () => {
  it('should stop with an empty frontier when the player stands alone on a single tile', () => {
    const player = createStandingPlayer(5, 48);

    const scan = computeExpandedScan(
      { level: SINGLE_TILE },
      createStartScan(SINGLE_TILE, player),
    );

    expect(scan.frontier).toEqual([]);
  });

  it('should keep the cells of the player when the player stands alone on a single tile', () => {
    const player = createStandingPlayer(5, 48);

    const scan = computeExpandedScan(
      { level: SINGLE_TILE },
      createStartScan(SINGLE_TILE, player),
    );

    expect(
      every(computeStateCells(SINGLE_TILE, player), (cell) =>
        scan.cells.has(cell),
      ),
    ).toBe(true);
  });

  it('should reach cells beyond the start when the player stands on a flat floor', () => {
    const player = createStandingPlayer(5, 48);

    const scan = computeExpandedScan(
      { level: FLAT_FLOOR },
      createStartScan(FLAT_FLOOR, player),
    );

    expect(scan.cells.size).toBeGreaterThan(
      size(computeStateCells(FLAT_FLOOR, player)),
    );
    expect(scan.cells.has(31)).toBe(true);
  });

  it('should visit more spots than the start when the player stands on a flat floor', () => {
    const player = createStandingPlayer(5, 48);

    const scan = computeExpandedScan(
      { level: FLAT_FLOOR },
      createStartScan(FLAT_FLOOR, player),
    );

    expect(scan.visited.size).toBeGreaterThan(1);
  });
});
