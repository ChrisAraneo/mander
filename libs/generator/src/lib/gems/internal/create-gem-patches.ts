import { TILE_GEM } from '@mander/model';
import { map } from 'lodash-es';
import { GEM_REST_HEIGHT } from '../../consts';
import type { filterGemCandidatesApart } from './filter-gem-candidates-apart';

export const createGemPatches = ({
  tiles,
  candidates,
}: ReturnType<typeof filterGemCandidatesApart>) => ({
  tiles,
  patches: map(candidates, ({ row, column }) => ({
    row: row - GEM_REST_HEIGHT,
    column,
    tile: TILE_GEM,
  })),
});
