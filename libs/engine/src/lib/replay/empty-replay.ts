import type { Replay } from './replay';

export const emptyReplay = (worldName: string): Replay => ({
  worldName,
  startedAtMs: 0,
  entries: [],
});
