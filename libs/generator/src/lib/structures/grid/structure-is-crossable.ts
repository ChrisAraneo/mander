import { findIndex } from 'lodash-es';

import { SECTOR_WIDTH } from '../../consts';
import type { Structure } from '../types';
import { reachable } from './reachable';
import { structureSurfaces } from './structure-surfaces';

export const structureIsCrossable = (grid: Structure): boolean => {
  const surfaces = structureSurfaces(grid);
  const entryIndex = findIndex(surfaces, (surface) => surface.col === 0);
  const exitIndex = findIndex(
    surfaces,
    (surface) => surface.col === SECTOR_WIDTH - 1,
  );
  if (entryIndex < 0 || exitIndex < 0) return false;
  return (
    reachable(surfaces, entryIndex).has(exitIndex) &&
    reachable(surfaces, exitIndex).has(entryIndex)
  );
};
