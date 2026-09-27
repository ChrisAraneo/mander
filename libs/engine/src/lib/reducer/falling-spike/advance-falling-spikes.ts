import type { FallingSpike, Level, Player } from '@mander/model';
import { compact, map } from 'lodash-es';

import { stepFallingSpike } from './step-falling-spike';

export const advanceFallingSpikes = (
  level: Level,
  spikes: FallingSpike[],
  player: Player,
  elapsedSeconds: number,
): FallingSpike[] =>
  compact(
    map(spikes, (spike) =>
      stepFallingSpike(level, spike, player, elapsedSeconds),
    ),
  );
