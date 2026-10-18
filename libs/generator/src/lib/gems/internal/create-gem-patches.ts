import { TILE_GEM } from '@mander/model';
import { map } from 'lodash-es';
import { GEM_REST_HEIGHT } from '../../consts';
import type { ApartGemCandidates } from './types/apart-gem-candidates';
import type { GemPatch } from './types/gem-patch';

export const createGemPatches = ({
  tiles,
  candidates,
}: ApartGemCandidates): GemPatch => ({
  tiles,
  patches: map(candidates, ({ row, column }) => ({
    row: row - GEM_REST_HEIGHT,
    column,
    tile: TILE_GEM,
  })),
});
