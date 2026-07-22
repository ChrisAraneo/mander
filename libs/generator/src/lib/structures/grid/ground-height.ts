import { BLOCK, type Structure } from '../types';

export function groundHeight(grid: Structure, column: number): number {
  let stackedBlocks = 0;
  for (
    let row = grid.length - 1;
    row >= 0 && grid[row][column] === BLOCK;
    row--
  ) {
    stackedBlocks++;
  }
  return stackedBlocks;
}
