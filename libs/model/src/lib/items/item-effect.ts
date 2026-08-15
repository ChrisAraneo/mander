import type { HazardKind } from './hazard-kind';

export type ItemEffect =
  | { kind: 'NONE' }
  | { kind: 'HEART'; amount: number }
  | { kind: 'SCORE'; amount: number }
  | { kind: 'STAR'; amount: number }
  | { kind: 'BULLET'; amount: number }
  | { kind: 'FIREBALL'; amount: number }
  | { kind: 'WARD'; hazard: HazardKind };
