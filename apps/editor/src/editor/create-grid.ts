import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_WIDTH, STRUCTURE_HEIGHT } from '@mander/structures';
import { map, range, times } from 'lodash-es';
import { match } from 'ts-pattern';

const GROUND_ROW = STRUCTURE_HEIGHT - 1;

export const createGrid = (): number[][] =>
  map(range(STRUCTURE_HEIGHT), (row) =>
    times(STRUCTURE_WIDTH, () =>
      match(row)
        .with(GROUND_ROW, () => TILE_DIRT)
        .otherwise(() => TILE_AIR),
    ),
  );
