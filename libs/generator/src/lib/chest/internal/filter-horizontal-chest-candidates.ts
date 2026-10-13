import type { Tile } from '@mander/model';
import type { Spot } from '../../types/spot';
import { filterLeftOfPortal } from './filter-left-of-portal';
import { findAnchorColumn } from './find-anchor-column';

export const filterHorizontalChestCandidates = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[] => filterLeftOfPortal(candidates, findAnchorColumn(tiles));
