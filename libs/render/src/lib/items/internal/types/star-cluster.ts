import type { Point } from '@mander/utils';

export interface StarCluster {
  radius: number;
  spots: readonly Point[];
}
