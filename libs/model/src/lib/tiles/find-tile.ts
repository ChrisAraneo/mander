import { indexOf } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { Point } from '@mander/utils';
import type { Level } from '../level/level';
import type { Tile } from './tile';

const { number } = P;
const { lt } = number;

export const findTile = (level: Level, tile: Tile): Point | null => {
  const fromRow = (y: number): Point | null =>
    match(y)
      .with(lt(0), (): Point | null => null)
      .otherwise(() =>
        match(indexOf(level.tiles[y], tile))
          .with(-1, (): Point | null => fromRow(y - 1))
          .otherwise((x): Point => ({ x, y })),
      );

  return fromRow(level.height - 1);
};