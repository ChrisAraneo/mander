import type { Tile } from '@mander/model';
import type { Spot } from '../../types/spot';
import { filterBelowPortal } from './filter-below-portal';
import { findAnchorRow } from './find-anchor-row';

export const filterVerticalChestCandidates = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[] => filterBelowPortal(candidates, findAnchorRow(tiles));
