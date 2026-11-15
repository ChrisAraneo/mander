import type { Cannonball, Enemy } from '@mander/model';

export interface Salvo {
  enemies: Enemy[];
  cannonballs: Cannonball[];
}
