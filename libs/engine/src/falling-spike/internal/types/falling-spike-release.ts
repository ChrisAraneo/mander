import type { FallingSpike, Level } from '@mander/model';

export interface FallingSpikeRelease {
  level: Level;
  spike: FallingSpike;
  deltaSeconds: number;
  isReleased: boolean;
}
