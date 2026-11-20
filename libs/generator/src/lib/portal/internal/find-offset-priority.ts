import type { Tile } from '@mander/model';
import { indexOf, size } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Spot } from '../../types/spot';

const PREFERRED_PORTAL_OFFSETS = [1, 2, 3, 0];

const NOT_FOUND = -1;

const computeOffsetFromRight = (tiles: Tile[][], { column }: Spot): number =>
  size(tiles[0]) - 1 - column;

const getOffsetPriority = (offset: number): number =>
  match(indexOf(PREFERRED_PORTAL_OFFSETS, offset))
    .with(NOT_FOUND, () => offset)
    .otherwise((priority) => priority);

export const findOffsetPriority = (tiles: Tile[][], spot: Spot): number =>
  getOffsetPriority(computeOffsetFromRight(tiles, spot));
