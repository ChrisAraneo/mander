import { chain, every } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { PLAYER_CLEARANCE, SECTOR_WIDTH } from '../../consts';
import { AIR, BLOCK, ENEMY, type Structure } from '../types';
import { enemiesHaveFooting } from './enemies-have-footing';
import { groundHeight } from './ground-height';
import { structureIsCrossable } from './structure-is-crossable';
import { surfacesHaveHeadroom } from './surfaces-have-headroom';

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
    message: 'cells must be 0 (air), 1 (block) or 2 (enemy)',
    isValid: (grid) =>
      every(grid, (row) =>
        every(row, (cell) => cell === AIR || cell === BLOCK || cell === ENEMY),
      ),
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
        .with(P.when((issues: string[]) => issues.length > 0), (issues) => issues)
        .otherwise(() => failingMessages(grid, contentRules)),
    );
