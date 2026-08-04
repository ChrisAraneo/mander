import { last } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { Replay } from './replay';

export const replayDuration = (replay: Replay): number =>
  match(last(replay.entries))
    .with(P.nullish, () => 0)
    .otherwise((entry) => entry.atMs);
