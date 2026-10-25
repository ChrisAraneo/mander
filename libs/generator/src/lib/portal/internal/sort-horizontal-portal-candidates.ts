import { type Tile } from '@mander/model';
import { sortBy } from 'lodash-es';
import type { Spot } from '../../types/spot';
import { findOffsetPriority } from './find-offset-priority';

export const sortHorizontalPortalCandidates = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[] =>
  sortBy(candidates, (candidate) => findOffsetPriority(tiles, candidate));
