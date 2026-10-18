import { type Player, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { computeNextScan } from './compute-next-scan';
import { createStandingPlayer } from './create-standing-player';
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

const createAirbornePlayer = (left: number, top: number): Player => ({
  ...createStandingPlayer(left, top),
  statuses: { ...createStandingPlayer(left, top).statuses, isGrounded: false },
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const NEW_LANDING = createStandingPlayer(40, 16);

const OLD_LANDING = createStandingPlayer(104, 16);

const JUMPING_PLAYER = createAirbornePlayer(72, 0);

const SCAN: Scan = {
  visited: new Set([3073]),
  cells: new Set([0]),
  frontier: [],
};

describe('computeNextScan', () => {
  it('should add the node of every new landing to the visited nodes when the player lands somewhere new', () => {
    const scan = computeNextScan({ level: LEVEL }, SCAN, [
      NEW_LANDING,
      OLD_LANDING,
      JUMPING_PLAYER,
    ]);

    expect(scan.visited).toEqual(new Set([3073, 1025]));
  });

  it('should add the cells of every state to the cells when the player passes through them', () => {
    const scan = computeNextScan({ level: LEVEL }, SCAN, [
      NEW_LANDING,
      OLD_LANDING,
      JUMPING_PLAYER,
    ]);

    expect(scan.cells).toEqual(new Set([0, 1, 6, 11, 3, 8, 13, 2, 7]));
  });

  it('should keep only the landings not visited yet in the frontier when some were visited before', () => {
    const scan = computeNextScan({ level: LEVEL }, SCAN, [
      NEW_LANDING,
      OLD_LANDING,
      JUMPING_PLAYER,
    ]);

    expect(scan.frontier).toEqual([NEW_LANDING]);
  });

  it('should keep one landing in the frontier when the player lands on the same spot twice', () => {
    const scan = computeNextScan({ level: LEVEL }, SCAN, [
      NEW_LANDING,
      NEW_LANDING,
    ]);

    expect(scan.frontier).toEqual([NEW_LANDING]);
  });

  it('should leave the scan as it was when there are no states', () => {
    const scan = computeNextScan({ level: LEVEL }, SCAN, []);

    expect(scan).toEqual(SCAN);
  });
});
