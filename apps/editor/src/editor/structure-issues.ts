import {
  isSolidTile,
  TILE_AIR,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import {
  STRUCTURE_START,
  STRUCTURE_WIDTH,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
} from '@mander/structures';
import { every, filter, flatten, includes, map, size } from 'lodash-es';

const KNOWN_TILES = [
  TILE_AIR,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  STRUCTURE_START,
  STRUCTURE_END,
];

const countTile = (grid: number[][], tile: number): number =>
  size(filter(flatten(grid), (cell) => cell === tile));

const isKnown = (cell: number): boolean =>
  includes(KNOWN_TILES, cell) || isSolidTile(cell);

const enemiesHaveFooting = (grid: number[][]): boolean =>
  every(grid, (cells, row) =>
    every(
      cells,
      (cell, column) =>
        cell !== TILE_ENEMY ||
        (row + 1 < size(grid) && isSolidTile(grid[row + 1][column])),
    ),
  );

const spikesAreAnchored = (grid: number[][]): boolean =>
  every(grid, (cells, row) =>
    every(cells, (cell, column) => {
      if (cell === TILE_SPIKE)
        return row + 1 < size(grid) && isSolidTile(grid[row + 1][column]);
      if (cell === TILE_SPIKE_CEILING)
        return row - 1 >= 0 && isSolidTile(grid[row - 1][column]);
      return true;
    }),
  );

interface Rule {
  message: string;
  isValid: (grid: number[][]) => boolean;
}

const RULES: Rule[] = [
  {
    message: `the grid must be ${STRUCTURE_WIDTH} × ${STRUCTURE_HEIGHT} cells`,
    isValid: (grid) =>
      size(grid) === STRUCTURE_HEIGHT &&
      every(grid, (row) => size(row) === STRUCTURE_WIDTH),
  },
  {
    message:
      'every cell must be a tile the game knows, a start (98) or an end (99)',
    isValid: (grid) => every(grid, (row) => every(row, isKnown)),
  },
  {
    message: 'mark where the player enters with exactly one start (98)',
    isValid: (grid) => countTile(grid, STRUCTURE_START) === 1,
  },
  {
    message: 'mark where the player leaves with exactly one end (99)',
    isValid: (grid) => countTile(grid, STRUCTURE_END) === 1,
  },
  {
    message: 'every enemy needs a block directly beneath it to stand on',
    isValid: enemiesHaveFooting,
  },
  {
    message: 'a spike needs a block below it, a ceiling spike one above',
    isValid: spikesAreAnchored,
  },
];

export const structureIssues = (grid: number[][]): string[] =>
  map(
    filter(RULES, (rule) => !rule.isValid(grid)),
    (rule) => rule.message,
  );
