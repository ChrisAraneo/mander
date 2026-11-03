import type { CannonKind } from './cannon-kind';

export interface Cannon {
  kind: CannonKind;
  barrelAngle: number;
  roundIndex: number;
  position: {
    x: number;
    y: number;
  };
  timers: {
    reload: number;
  };
  statuses: {
    isFacingRight: boolean;
  };
}
