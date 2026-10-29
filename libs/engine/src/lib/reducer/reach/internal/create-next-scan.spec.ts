import { type Player, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createNextScan } from './create-next-scan';
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
  shooterEnemyChance: 0,
});

const createAirbornePlayer = (left: number, top: number): Player => ({
  ...createStandingPlayer(left, top),
  statuses: { ...createStandingPlayer(left, top).statuses, isGrounded: false },
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const NEW_LANDING = createStandingPlayer(40, 16);

const OLD_LANDING = createStandingPlayer(104, 16);

const JUMPING_PLAYER = createAirbornePlayer(72, 0);

const STATES = [NEW_LANDING, OLD_LANDING, JUMPING_PLAYER];

const createScan = (): Scan => ({
  visited: new Set([3073]),
  cells: new Set([0]),
  frontier: [],
});

describe('createNextScan', () => {
  it('should add the node of every new landing to the visited nodes when there are new landings', () => {
    const scan = createNextScan({ level: LEVEL }, createScan(), STATES, [
      NEW_LANDING,
    ]);

    expect(scan.visited).toEqual(new Set([3073, 1025]));
  });

  it('should add the cells of every state to the cells when the player passes through them', () => {
    const scan = createNextScan({ level: LEVEL }, createScan(), STATES, [
      NEW_LANDING,
    ]);

    expect(scan.cells).toEqual(new Set([0, 1, 6, 11, 3, 8, 13, 2, 7]));
  });

  it('should make the same new landings the frontier when there are new landings', () => {
    const nodes = [NEW_LANDING];

    const scan = createNextScan({ level: LEVEL }, createScan(), STATES, nodes);

    expect(scan.frontier).toBe(nodes);
  });

  it('should not change the old scan when it adds the new landings', () => {
    const old = createScan();

    createNextScan({ level: LEVEL }, old, STATES, [NEW_LANDING]);

    expect(old).toEqual(createScan());
  });

  it('should give a scan like the old one when there are no states and no landings', () => {
    const scan = createNextScan({ level: LEVEL }, createScan(), [], []);

    expect(scan).toEqual(createScan());
  });
});
