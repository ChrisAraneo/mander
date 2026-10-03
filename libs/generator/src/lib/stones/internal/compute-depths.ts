import { isSolidTile, type Tile } from '@mander/model';
import { map, reduce } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Field } from './field';

const UNBURIED = -1;

export const computeDepths = (tiles: Tile[][]): Field =>
  reduce(
    tiles,
    (depths: Field, cells, row): Field => [
      ...depths,
      map(cells, (tile, column) =>
        match(isSolidTile(tile))
          .with(true, () => (depths[row - 1]?.[column] ?? UNBURIED) + 1)
          .otherwise(() => UNBURIED),
      ),
    ],
    [],
  );
