import { describe, expect, it } from 'vitest';

import {
  MAX_JUMP_TILES,
  PLAYER_CLEARANCE,
  SECTOR_WIDTH,
  STRUCTURE_HEIGHT,
} from '../consts';
import { createRng } from '../rng';
import {
  formatStructure,
  groundHeight,
  maxJumpColumns,
  structureExitLift,
  structureIsCrossable,
  structureIssues,
} from './grid';
import { HARD_STRUCTURES, NORMAL_STRUCTURES } from './library';
import { rollStructure, structurePool } from './structures';
import { AIR, BLOCK, ENEMY, type Structure } from './types';

describe('maxJumpColumns', () => {
  it('mirrors the engine jump arc: easy drops, harder climbs, nothing past a rise of 4', () => {
    expect(maxJumpColumns(-10)).toBe(6);
    expect(maxJumpColumns(-1)).toBe(6);
    expect(maxJumpColumns(0)).toBe(5);
    expect(maxJumpColumns(1)).toBe(4);
    expect(maxJumpColumns(2)).toBe(4);
    expect(maxJumpColumns(3)).toBe(3);
    expect(maxJumpColumns(4)).toBe(2);
    expect(maxJumpColumns(5)).toBe(0);
    expect(maxJumpColumns(10)).toBe(0);
  });

  it('stops one tile short of the peak of a held jump', () => {
    expect(maxJumpColumns(MAX_JUMP_TILES - 1)).toBeGreaterThan(0);
    expect(maxJumpColumns(MAX_JUMP_TILES)).toBe(0);
  });
});

const maxBridgeHeight = (grid: Structure): number => {
  const rows = grid.length;
  let max = 0;
  for (let c = 0; c < SECTOR_WIDTH; c++) {
    if (groundHeight(grid, c) === 0) {
      for (let r = 0; r < rows; r++) {
        if (grid[r][c] === BLOCK) max = Math.max(max, rows - 1 - r);
      }
    }
  }
  return max;
};

const POOLS: Array<[string, readonly Structure[]]> = [
  ['NORMAL', NORMAL_STRUCTURES],
  ['HARD', HARD_STRUCTURES],
];

describe('structure library', () => {
  it('offers several distinct structures per difficulty', () => {
    expect(NORMAL_STRUCTURES.length).toBeGreaterThanOrEqual(4);
    expect(HARD_STRUCTURES.length).toBeGreaterThanOrEqual(4);
  });

  describe.each(POOLS)('%s pool', (_tag, pool) => {
    it('every structure is a valid STRUCTURE_HEIGHT x SECTOR_WIDTH grid of 0/1/2 cells', () => {
      for (const grid of pool) {
        expect(grid).toHaveLength(STRUCTURE_HEIGHT);
        for (const row of grid) {
          expect(row).toHaveLength(SECTOR_WIDTH);
          for (const cell of row)
            expect(cell === AIR || cell === BLOCK || cell === ENEMY).toBe(true);
        }
      }
    });

    it('every structure passes validation (flush entry, solid exit, crossable both ways)', () => {
      for (const grid of pool) {
        expect(structureIssues(grid), formatStructure(grid)).toEqual([]);
        expect(structureIsCrossable(grid)).toBe(true);
      }
    });
  });

  it('makes the hard pool climb steeper and jump higher than the normal pool', () => {
    const normalLift = Math.max(
      ...NORMAL_STRUCTURES.map((grid) => structureExitLift(grid)),
    );
    const hardLift = Math.max(
      ...HARD_STRUCTURES.map((grid) => structureExitLift(grid)),
    );
    expect(normalLift).toBeLessThanOrEqual(2);
    expect(hardLift).toBeGreaterThanOrEqual(3);

    const normalBridge = Math.max(
      ...NORMAL_STRUCTURES.map((grid) => maxBridgeHeight(grid)),
    );
    const hardBridge = Math.max(
      ...HARD_STRUCTURES.map((grid) => maxBridgeHeight(grid)),
    );
    expect(normalBridge).toBeLessThanOrEqual(2);
    expect(hardBridge).toBeGreaterThanOrEqual(3);
  });
});

const rowOfAir = (): number[] =>
  Array.from({ length: SECTOR_WIDTH }, (): number => AIR);

const flatGrid = (): Structure => {
  const grid = Array.from({ length: STRUCTURE_HEIGHT }, rowOfAir);
  grid[STRUCTURE_HEIGHT - 1] = Array.from(
    { length: SECTOR_WIDTH },
    (): number => BLOCK,
  );
  return grid;
};

describe('structureIssues', () => {
  it('accepts a plain flat grid', () => {
    expect(structureIssues(flatGrid())).toEqual([]);
  });

  it('rejects a wrong-width row', () => {
    const grid = flatGrid();
    grid[0] = [BLOCK];
    expect(structureIssues(grid).join(' ')).toContain('cells wide');
  });

  it('rejects a raised or missing left edge', () => {
    const raised = flatGrid();
    raised[STRUCTURE_HEIGHT - 2][0] = BLOCK;
    expect(structureIssues(raised).join(' ')).toContain('flush ground');

    const gap = flatGrid();
    gap[STRUCTURE_HEIGHT - 1][0] = AIR;
    expect(structureIssues(gap).join(' ')).toContain('flush ground');
  });

  it('rejects an unbridged pit that cannot be crossed', () => {
    const grid = flatGrid();
    for (let c = 6; c <= 13; c++) grid[STRUCTURE_HEIGHT - 1][c] = AIR;
    expect(structureIssues(grid).join(' ')).toContain('cannot cross');
  });

  it('rejects a ceiling the player is too tall to walk under', () => {
    const grid = flatGrid();
    grid[STRUCTURE_HEIGHT - 1 - PLAYER_CLEARANCE][8] = BLOCK;
    expect(structureIssues(grid).join(' ')).toContain('clear cells above');
  });

  it('accepts a ceiling raised just clear of the players head', () => {
    const grid = flatGrid();
    grid[STRUCTURE_HEIGHT - 2 - PLAYER_CLEARANCE][8] = BLOCK;
    expect(structureIssues(grid)).toEqual([]);
  });

  it('accepts an enemy standing on a block', () => {
    const grid = flatGrid();
    grid[STRUCTURE_HEIGHT - 2][5] = ENEMY;
    expect(structureIssues(grid)).toEqual([]);
  });

  it('rejects an enemy floating with no block beneath it', () => {
    const grid = flatGrid();
    grid[STRUCTURE_HEIGHT - 3][5] = ENEMY;
    expect(structureIssues(grid).join(' ')).toContain('beneath it');
  });
});

describe('formatStructure', () => {
  it('round-trips to a paste-ready literal that parses back to the same grid', () => {
    const grid = NORMAL_STRUCTURES[3];
    const json = formatStructure(grid).replaceAll(
      /,(?<trailing>\s*\])/gu,
      '$<trailing>',
    );
    const parsed: unknown = JSON.parse(json);
    expect(parsed).toEqual(grid);
  });
});

describe('rollStructure', () => {
  it('draws from the matching difficulty pool', () => {
    expect(structurePool('NORMAL')).toBe(NORMAL_STRUCTURES);
    expect(structurePool('HARD')).toBe(HARD_STRUCTURES);
  });

  it('is deterministic for the same rng state and returns a pool member', () => {
    const a = rollStructure(createRng('SAME'), 'NORMAL');
    const b = rollStructure(createRng('SAME'), 'NORMAL');
    expect(a).toBe(b);
    expect(NORMAL_STRUCTURES).toContain(a);
  });
});
