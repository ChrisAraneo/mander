import { every } from 'lodash-es';
import { chain } from '@mander/utils';
import { match, P } from 'ts-pattern';

import { PLAYER_CLEARANCE, SECTOR_WIDTH } from '../../consts';
import {
  AIR,
  BLOCK_CELLS,
  ENEMY,
  SPIKE,
  SPIKE_CEILING,
  type Structure,
} from '../types';
import { enemiesHaveFooting } from './enemies-have-footing';
import { groundHeight } from './ground-height';
import { spikesAreAnchored } from './spikes-are-anchored';
import { structureIsCrossable } from './structure-is-crossable';
import { surfacesHaveHeadroom } from './surfaces-have-headroom';

const KNOWN_CELLS = [AIR, ENEMY, SPIKE, SPIKE_CEILING, ...BLOCK_CELLS];

interface Rule {
  message: string;
  isValid: (grid: Structure) => boolean;
}

const shapeRules: Rule[] = [
  {
    message: `every row must be ${SECTOR_WIDTH} cells wide`,
    isValid: (grid) => every(grid, (row) => row.length === SECTOR_WIDTH),
  },
  {
    message:
      'cells must be 0 (air), 2 (enemy), 3 (spike), 4 (ceiling spike) or a block: 1 (dirt), 5 (brick), 6 (stone), 7 (wood), 8 (ceramic)',
    isValid: (grid) =>
      every(grid, (row) => every(row, (cell) => KNOWN_CELLS.includes(cell))),
  },
];

const contentRules: Rule[] = [
  {
    message:
      'the left edge must be flush ground: only the bottom-left cell a block',
    isValid: (grid) => groundHeight(grid, 0) === 1,
  },
  {
    message:
      'the right edge must be solid ground so the next structure connects',
    isValid: (grid) => groundHeight(grid, SECTOR_WIDTH - 1) >= 1,
  },
  {
    message: 'the player cannot cross it both ways — mind the jump limits',
    isValid: (grid) => structureIsCrossable(grid),
  },
  {
    message: `every surface needs ${PLAYER_CLEARANCE} clear cells above it — the player stands that tall`,
    isValid: (grid) => surfacesHaveHeadroom(grid),
  },
  {
    message: 'every enemy (2) needs a block directly beneath it to stand on',
    isValid: (grid) => enemiesHaveFooting(grid),
  },
  {
    message:
      'a floor spike (3) needs a block below it, a ceiling spike (4) a block above',
    isValid: (grid) => spikesAreAnchored(grid),
  },
];

const failingMessages = (grid: Structure, rules: Rule[]): string[] =>
  chain(rules)
    .filter((rule) => !rule.isValid(grid))
    .map((rule) => rule.message)
    .value();

export const structureIssues = (grid: Structure): string[] =>
  match(grid.length)
    .with(0, () => ['grid is empty'])
    .otherwise(() =>
      match(failingMessages(grid, shapeRules))
        .with(
          P.when((issues: string[]) => issues.length > 0),
          (issues) => issues,
        )
        .otherwise(() => failingMessages(grid, contentRules)),
    );
