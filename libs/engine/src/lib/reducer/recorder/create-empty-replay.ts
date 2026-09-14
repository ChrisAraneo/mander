import type { Replay } from './types/replay';

export const createEmptyReplay = (worldName: string): Replay => ({
  worldName,
  steps: 0,
  entries: [],
});
