import type { FallingSpike, Level, Player } from '@mander/model';
import { compact, map } from 'lodash-es';
import { nextFallingSpike } from './next-falling-spike';

export const nextFallingSpikes = (
  level: Level,
  spikes: FallingSpike[],
  player: Player,
  elapsedSeconds: number,
): FallingSpike[] =>
  compact(
    map(spikes, (spike) =>
      nextFallingSpike(level, spike, player, elapsedSeconds),
    ),
  );
