import type { Facing } from '../../../facing/types/facing';

export interface EnemyWalk {
  facing: Facing;
  nextX: number;
}
