import { TILE_GEM } from '@mander/model';
import { map } from 'lodash-es';
import { GEM_REST_HEIGHT } from '../../consts';
import type { pickGemCandidates } from './pick-gem-candidates';

export const createGemPatches = ({
  tiles,
  candidates,
}: ReturnType<typeof pickGemCandidates>) => ({
  tiles,
  patches: map(candidates, ({ row, column }) => ({
    row: row - GEM_REST_HEIGHT,
    column,
    tile: TILE_GEM,
  })),
});
