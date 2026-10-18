import { compact, map } from 'lodash-es';
import type { GameLevel } from '../../types/game-level';
import type { Replay } from '../recorder/types/replay';
import { parseReplayEntry } from './internal/parse-replay-entry';
import type { PackedReplay } from './types/packed-replay';

export const decodeReplay = (
  packed: PackedReplay,
  levels: GameLevel[],
): Replay => ({
  worldName: packed.worldName,
  steps: packed.steps,
  entries: compact(
    map(packed.entries, (entry) => parseReplayEntry(entry, levels)),
  ),
});
