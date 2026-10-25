import {
  isSolidTile,
  type Layers,
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
  findVerticalIssues,
} from '@mander/structures';
import { concat, every, filter, flatten, includes, map, size } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { getHeight } from './get-height';
import type { Pool } from './types/pool';
import type { StructureRule } from './types/structure-rule';

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

const RULES: readonly StructureRule[] = [
  'SIZE',
  'KNOWN_TILES',
  'BACK_LAYER',
  'ONE_START',
  'ONE_END',
  'ANCHORED_HAZARDS',
];

const countTile = (grid: number[][], tile: number): number =>
  size(filter(flatten(grid), (cell) => cell === tile));

const isKnown = (cell: number): boolean =>
  includes(KNOWN_TILES, cell) || isSolidTile(cell);

const canBeBehind = (cell: number): boolean =>
  cell === TILE_AIR || isSolidTile(cell);

const hasAllHazardsAnchored = (grid: number[][]): boolean =>
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

const isCut = (grid: number[][], tall: number): boolean =>
  size(grid) === tall && every(grid, (row) => size(row) === STRUCTURE_WIDTH);

const isSketchCut = ({ tiles, backTiles }: Layers, pool: Pool): boolean =>
  isCut(tiles, getHeight(pool)) && isCut(backTiles, getHeight(pool));

const isStructureRuleMet = (
  sketch: Layers,
  pool: Pool,
  rule: StructureRule,
): boolean =>
  match(rule)
    .with('SIZE', () => isSketchCut(sketch, pool))
    .with('KNOWN_TILES', () =>
      every(sketch.tiles, (row) => every(row, isKnown)),
    )
    .with('BACK_LAYER', () =>
      every(sketch.backTiles, (row) => every(row, canBeBehind)),
    )
    .with('ONE_START', () => countTile(sketch.tiles, STRUCTURE_START) === 1)
    .with('ONE_END', () => countTile(sketch.tiles, STRUCTURE_END) === 1)
    .with('ANCHORED_HAZARDS', () => hasAllHazardsAnchored(sketch.tiles))
    .exhaustive();

const formatStructureRuleMessage = (rule: StructureRule, pool: Pool): string =>
  match(rule)
    .with(
      'SIZE',
      () => `both layers must be ${STRUCTURE_WIDTH} × ${getHeight(pool)} cells`,
    )
    .with(
      'KNOWN_TILES',
      () =>
        'every cell must be a tile the game knows, a start (98) or an end (99)',
    )
    .with(
      'BACK_LAYER',
      () =>
        'the back layer takes blocks alone — a hazard or a marker has nothing to do behind the level',
    )
    .with(
      'ONE_START',
      () => 'mark where the player enters with exactly one start (98)',
    )
    .with(
      'ONE_END',
      () => 'mark where the player leaves with exactly one end (99)',
    )
    .with(
      'ANCHORED_HAZARDS',
      () =>
        'a spike or beartrap needs a block below it, a ceiling or falling spike one above — a background block is not something to stand on',
    )
    .exhaustive();

const findPoolIssues = (sketch: Layers, pool: Pool): string[] =>
  match(pool)
    .with('vertical', () => findVerticalIssues(sketch.tiles))
    .otherwise((): string[] => []);

export const findStructureIssues = (sketch: Layers, pool: Pool): string[] =>
  pipe(
    RULES,
    (rules) => filter(rules, (rule) => !isStructureRuleMet(sketch, pool, rule)),
    (broken) => map(broken, (rule) => formatStructureRuleMessage(rule, pool)),
    (messages) => concat(messages, findPoolIssues(sketch, pool)),
  );
