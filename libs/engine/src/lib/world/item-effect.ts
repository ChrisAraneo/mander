export type ItemEffect =
  | { kind: 'NONE' }
  | { kind: 'SPEED'; percent: number }
  | { kind: 'HEART'; amount: number };
