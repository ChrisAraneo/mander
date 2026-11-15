import type { RecorderState } from './types/recorder-state';
import type { Replay } from './types/replay';

export const toReplay = (recorder: RecorderState): Replay => ({
  worldName: recorder.worldName,
  steps: recorder.step,
  entries: recorder.entries,
});
