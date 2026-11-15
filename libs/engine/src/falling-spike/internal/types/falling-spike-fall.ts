import type { FallingSpike, Level } from '@mander/model';

export interface FallingSpikeFall {
  level: Level;
  spike: FallingSpike;
  deltaSeconds: number;
  velocityY: number;
}
