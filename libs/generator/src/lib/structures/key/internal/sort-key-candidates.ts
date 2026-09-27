import type { Tile } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { floor, size, sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { findKeyCandidates } from './find-key-candidates';

const getMiddleSeam = (tiles: Tile[][]) =>
  floor(size(tiles[0]) / 2 / STRUCTURE_WIDTH) * STRUCTURE_WIDTH;

const getMiddleRow = (tiles: Tile[][]) => floor(size(tiles) / 2);

export const sortKeyCandidates = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof findKeyCandidates>) => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      sortBy(candidates, [
        (candidate) => Math.abs(candidate.column - getMiddleSeam(tiles)),
        (candidate) => candidate.column,
      ]),
    )
    .with('VERTICAL', () =>
      sortBy(candidates, (candidate) =>
        Math.abs(candidate.row - getMiddleRow(tiles)),
      ),
    )
    .exhaustive(),
});
