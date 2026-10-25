import type { Random } from '@mander/engine';
import type { Tile } from '@mander/model';

export interface BeartrapRemovalRate {
  tiles: Tile[][];
  rate: number;
  random: Random;
}
