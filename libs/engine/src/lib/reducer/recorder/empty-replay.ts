import type { Replay } from './types/replay';

export const emptyReplay = (worldName: string): Replay => ({
  worldName,
  steps: 0,
  entries: [],
});
