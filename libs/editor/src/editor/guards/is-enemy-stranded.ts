import { type Structure, STRUCTURE_HEIGHT, BLOCK } from '@mander/generator';

export const isEnemyStranded = (
  grid: Structure,
  row: number,
  column: number,
): boolean => row + 1 >= STRUCTURE_HEIGHT || grid[row + 1][column] !== BLOCK;
