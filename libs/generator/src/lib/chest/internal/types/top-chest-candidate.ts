import type { Tile } from '@mander/model';
import type { Spot } from '../../../types/spot';

export interface TopChestCandidate {
  tiles: Tile[][];
  candidate: Spot | undefined;
}
