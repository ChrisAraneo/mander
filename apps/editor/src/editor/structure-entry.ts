export type Pool = 'normal' | 'hard' | 'vertical';

export interface StructureEntry {
  name: string;
  pool: Pool;
  grid: number[][];
}
