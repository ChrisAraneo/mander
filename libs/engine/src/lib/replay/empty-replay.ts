import type { Replay } from './types/replay';

export const emptyReplay = (worldName: string): Replay => ({
  worldName,
  startedAtMs: 0,
  entries: [],
});
