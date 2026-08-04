import type { Tile } from '../tile/tile';

export const TILE_ENEMY: Tile = 7;

export type EnemyKind = 'STANDARD' | 'HORNED' | 'FLYING';

export interface Enemy {
  kind: EnemyKind;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: {
      current: number;
      max: number;
    };
    y: {
      current: number;
      max: number;
    };
  };
  timers: {
    death: number | null;
  };
  spawn: {
    x: number;
    y: number;
  };
  statuses: {
    isFacingRight: boolean;
    isGrounded: boolean;
  };
}
