import { TILE_GEM } from '@mander/model';
import { map } from 'lodash-es';
import { GEM_REST_HEIGHT } from '../../consts';
import type { GemApartCandidates } from './types/gem-apart-candidates';
import type { GemPatch } from './types/gem-patch';

export const createGemPatches = ({
  tiles,
  candidates,
}: GemApartCandidates): GemPatch => ({
  tiles,
  patches: map(candidates, ({ row, column }) => ({
    row: row - GEM_REST_HEIGHT,
    column,
    tile: TILE_GEM,
  })),
});
