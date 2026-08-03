export type ItemEffect =
  | { kind: 'NONE' }
  | { kind: 'HEART'; amount: number }
  | { kind: 'SCORE'; amount: number };
