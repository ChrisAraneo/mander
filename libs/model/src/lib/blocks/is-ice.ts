import { match, P } from 'ts-pattern';
import type { Level } from '../types/level';
import { isIceTile } from './is-ice-tile';

const { when } = P;

export const isIce = (level: Level, tileX: number, tileY: number): boolean =>
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
    .otherwise(() => isIceTile(level.tiles[tileY][tileX]));
