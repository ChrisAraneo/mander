import { describe, expect, it } from 'vitest';

import { SECTOR_WIDTH, STRUCTURE_HEIGHT } from '../consts';
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
  it('mirrors the engine jump arc: easy drops, harder climbs, nothing past a rise of 3', () => {
    expect(maxJumpColumns(-10)).toBe(6);
    expect(maxJumpColumns(-1)).toBe(6);
    expect(maxJumpColumns(0)).toBe(5);
    expect(maxJumpColumns(1)).toBe(3);
    expect(maxJumpColumns(2)).toBe(3);
    expect(maxJumpColumns(3)).toBe(2);
    expect(maxJumpColumns(4)).toBe(0);
    expect(maxJumpColumns(10)).toBe(0);
  });
});

function maxBridgeHeight(grid: Structure): number {
  const rows = grid.length;
  let max = 0;
  for (let c = 0; c < SECTOR_WIDTH; c++) {
    if (groundHeight(grid, c) !== 0) continue;
    for (let r = 0; r < rows; r++) {
      if (grid[r][c] === BLOCK) max = Math.max(max, rows - 1 - r);
    }
  }
  return max;
}

const POOLS: Array<[string, readonly Structure[]]> = [
  ['normal', NORMAL_STRUCTURES],
  ['hard', HARD_STRUCTURES],
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
    const normalLift = Math.max(...NORMAL_STRUCTURES.map(structureExitLift));
    const hardLift = Math.max(...HARD_STRUCTURES.map(structureExitLift));
    expect(normalLift).toBeLessThanOrEqual(2);
    expect(hardLift).toBeGreaterThanOrEqual(3);

    const normalBridge = Math.max(...NORMAL_STRUCTURES.map(maxBridgeHeight));
    const hardBridge = Math.max(...HARD_STRUCTURES.map(maxBridgeHeight));
    expect(normalBridge).toBeLessThanOrEqual(2);
    expect(hardBridge).toBeGreaterThanOrEqual(3);
  });
});

describe('structureIssues', () => {
  const rowOfAir = () => new Array(SECTOR_WIDTH).fill(AIR);
  const flatGrid = (): Structure => {
    const grid = Array.from({ length: STRUCTURE_HEIGHT }, rowOfAir);
    grid[STRUCTURE_HEIGHT - 1] = new Array(SECTOR_WIDTH).fill(BLOCK);
    return grid;
  };

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
    const json = formatStructure(grid).replaceAll(/,(\s*])/g, '$1');
    expect(JSON.parse(json) as Structure).toEqual(grid);
  });
});

describe('rollStructure', () => {
  it('draws from the matching difficulty pool', () => {
    expect(structurePool('normal')).toBe(NORMAL_STRUCTURES);
    expect(structurePool('hard')).toBe(HARD_STRUCTURES);
  });

  it('is deterministic for the same rng state and returns a pool member', () => {
    const a = rollStructure(createRng('same'), 'normal');
    const b = rollStructure(createRng('same'), 'normal');
    expect(a).toBe(b);
    expect(NORMAL_STRUCTURES).toContain(a);
  });
});
