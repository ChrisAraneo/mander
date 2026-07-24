import { every } from 'lodash-es';

import type { Structure } from '../types';
import { structureSurfaces } from './structure-surfaces';
import { surfaceHasHeadroom } from './surface-has-headroom';

export const surfacesHaveHeadroom = (grid: Structure): boolean =>
  every(structureSurfaces(grid), (surface) =>
    surfaceHasHeadroom(grid, surface),
  );
