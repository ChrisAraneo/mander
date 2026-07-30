import { match, P } from 'ts-pattern';

import type { Level } from '../level/level';
import { isSpikeTile } from './is-spike-tile';

const { when } = P;

export const isSpike = (level: Level, tileX: number, tileY: number): boolean =>
  match(true)
    .with(
      when(
        () =>
          tileX < 0 ||
          tileX >= level.width ||
          tileY < 0 ||
          tileY >= level.height,
      ),
      () => false,
    )
    .otherwise(() => isSpikeTile(level.tiles[tileY][tileX]));
