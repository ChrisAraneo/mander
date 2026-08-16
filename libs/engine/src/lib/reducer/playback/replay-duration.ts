import { last } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { Replay } from '../recorder/types/replay';

const { nullish } = P;

export const replayDuration = (replay: Replay): number =>
  match(last(replay.entries))
    .with(nullish, () => 0)
    .otherwise((entry) => entry.atMs);
