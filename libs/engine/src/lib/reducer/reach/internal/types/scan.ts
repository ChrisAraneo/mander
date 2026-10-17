import type { Player } from '@mander/model';

export interface Scan {
  visited: Set<number>;
  cells: Set<number>;
  frontier: Player[];
}
