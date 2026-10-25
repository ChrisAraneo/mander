import { map } from 'lodash-es';
import type { Replay } from '../recorder/types/replay';
import { serializeReplayAction } from './internal/serialize-replay-action';
import type { PackedEntry } from './types/packed-entry';
import type { PackedReplay } from './types/packed-replay';

export const serializeReplay = (replay: Replay): PackedReplay => ({
  worldName: replay.worldName,
  steps: replay.steps,
  entries: map(replay.entries, ({ atStep, action }): PackedEntry => [
    atStep,
    ...serializeReplayAction(action),
  ]),
});
