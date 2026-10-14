import type { Tile } from '@mander/model';

export interface CannonArming {
  tiles: Tile[][];
  armed: boolean;
}
