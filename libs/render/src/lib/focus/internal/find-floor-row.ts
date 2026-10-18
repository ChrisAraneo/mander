import type { Level } from '@mander/model';
import { findIndex } from 'lodash-es';
import { match } from 'ts-pattern';
import { isFloorRow } from './is-floor-row';

const NOT_FOUND = -1;

export const findFloorRow = (level: Level): number =>
  match(findIndex(level.tiles, isFloorRow))
    .with(NOT_FOUND, () => level.height / 2)
    .otherwise((found) => found);
