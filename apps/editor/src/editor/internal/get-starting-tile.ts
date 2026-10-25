import { TILE_AIR, TILE_DIRT } from '@mander/model';
import {
  STRUCTURE_END,
  STRUCTURE_START,
  VERTICAL_LAUNCH_ROW,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_PLATFORM_COLUMNS,
  VERTICAL_END_ROW,
  VERTICAL_START_ROW,
} from '@mander/structures';
import { includes } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Cell } from '../types/cell';

export const getStartingTile = ({ row, column }: Cell): number =>
  match({ row, column })
    .with({ row: VERTICAL_END_ROW, column: VERTICAL_MARKER_COLUMN }, () =>
      Number(STRUCTURE_END),
    )
    .with({ row: VERTICAL_START_ROW, column: VERTICAL_MARKER_COLUMN }, () =>
      Number(STRUCTURE_START),
    )
    .when(
      () =>
        row === VERTICAL_LAUNCH_ROW &&
        includes(VERTICAL_PLATFORM_COLUMNS, column),
      () => TILE_DIRT,
    )
    .otherwise(() => TILE_AIR);
