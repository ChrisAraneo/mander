import { type Player, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { createNextScan } from './create-next-scan';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const createAirbornePlayer = (left: number, top: number): Player => ({
  ...createStandingPlayer(left, top),
  statuses: { ...createStandingPlayer(left, top).statuses, isGrounded: false },
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const NEW_LANDING_X = 40;

const OLD_LANDING_X = 104;

const LANDING_Y = 16;

const JUMPING_X = 72;

const JUMPING_Y = 0;

const FIRST_CELL = 0;

const NEW_LANDING = createStandingPlayer(NEW_LANDING_X, LANDING_Y);

const OLD_LANDING = createStandingPlayer(OLD_LANDING_X, LANDING_Y);

const JUMPING_PLAYER = createAirbornePlayer(JUMPING_X, JUMPING_Y);

const STATES = [NEW_LANDING, OLD_LANDING, JUMPING_PLAYER];

const createScan = (): Scan => ({
  visited: new Set([hashPlayerNode(OLD_LANDING)]),
  cells: new Set([FIRST_CELL]),
  frontier: [],
});

describe('createNextScan', () => {
  it('should add the node of every new landing to the visited nodes when there are new landings', () => {
    const scan = createNextScan({ level: LEVEL }, createScan(), STATES, [
      NEW_LANDING,
    ]);

    expect(scan.visited).toEqual(
      new Set([hashPlayerNode(OLD_LANDING), hashPlayerNode(NEW_LANDING)]),
    );
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
