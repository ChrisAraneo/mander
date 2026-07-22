import { every } from 'lodash-es';

import { SECTOR_WIDTH } from '../../consts';
import { AIR, BLOCK, ENEMY, type Structure } from '../types';
import { enemiesHaveFooting } from './enemies-have-footing';
import { groundHeight } from './ground-height';
import { structureIsCrossable } from './structure-is-crossable';

export function structureIssues(grid: Structure): string[] {
  const issues: string[] = [];
  if (grid.length === 0) return ['grid is empty'];
  if (!every(grid, (row) => row.length === SECTOR_WIDTH)) {
    issues.push(`every row must be ${SECTOR_WIDTH} cells wide`);
  }
  if (
    !every(grid, (row) =>
      every(row, (cell) => cell === AIR || cell === BLOCK || cell === ENEMY),
    )
  ) {
    issues.push('cells must be 0 (air), 1 (block) or 2 (enemy)');
  }
  if (issues.length > 0) return issues;

  if (groundHeight(grid, 0) !== 1) {
    issues.push(
      'the left edge must be flush ground: only the bottom-left cell a block',
    );
  }
  if (groundHeight(grid, SECTOR_WIDTH - 1) < 1) {
    issues.push(
      'the right edge must be solid ground so the next structure connects',
    );
  }
  if (!structureIsCrossable(grid)) {
    issues.push('the player cannot cross it both ways — mind the jump limits');
  }
  if (!enemiesHaveFooting(grid)) {
    issues.push(
      'every enemy (2) needs a block directly beneath it to stand on',
    );
  }
  return issues;
}
