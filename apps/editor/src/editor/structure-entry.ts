export type Difficulty = 'normal' | 'hard';

export interface StructureEntry {
  name: string;
  difficulty: Difficulty;
  grid: number[][];
}
