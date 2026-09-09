import {
  isSolidTile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import {
  STRUCTURE_START,
  STRUCTURE_WIDTH,
  STRUCTURE_END,
  verticalIssues,
} from '@mander/structures';
import { every, filter, flatten, includes, map, size } from 'lodash-es';
import { match } from 'ts-pattern';

import { heightOf } from './create-grid';
import type { Pool } from './structure-entry';

const KNOWN_TILES = [
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
  STRUCTURE_START,
  STRUCTURE_END,
];

const countTile = (grid: number[][], tile: number): number =>
  size(filter(flatten(grid), (cell) => cell === tile));

const isKnown = (cell: number): boolean =>
  includes(KNOWN_TILES, cell) || isSolidTile(cell);

const hazardsAreAnchored = (grid: number[][]): boolean =>
  every(grid, (cells, row) =>
    every(cells, (cell, column) =>
      match(cell)
        .with(
          TILE_SPIKE,
          TILE_BEARTRAP,
          () => row + 1 < size(grid) && isSolidTile(grid[row + 1][column]),
        )
        .with(
          TILE_SPIKE_CEILING,
          TILE_SPIKE_FALLING,
          () => row - 1 >= 0 && isSolidTile(grid[row - 1][column]),
        )
        .otherwise(() => true),
    ),
  );

interface Rule {
  message: string;
  isValid: (grid: number[][]) => boolean;
}

const sizeRule = (pool: Pool): Rule => ({
  message: `the grid must be ${STRUCTURE_WIDTH} × ${heightOf(pool)} cells`,
  isValid: (grid) =>
    size(grid) === heightOf(pool) &&
    every(grid, (row) => size(row) === STRUCTURE_WIDTH),
});

const RULES: Rule[] = [
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
    message:
      'a spike or beartrap needs a block below it, a ceiling or falling spike one above',
    isValid: hazardsAreAnchored,
  },
];

const poolIssues = (grid: number[][], pool: Pool): string[] =>
  match(pool)
    .with('vertical', () => verticalIssues(grid))
    .otherwise((): string[] => []);

export const structureIssues = (grid: number[][], pool: Pool): string[] => [
  ...map(
    filter([sizeRule(pool), ...RULES], (rule) => !rule.isValid(grid)),
    (rule) => rule.message,
  ),
  ...poolIssues(grid, pool),
];
