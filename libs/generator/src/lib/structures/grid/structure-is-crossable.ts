import { chain, findIndex } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { SECTOR_WIDTH } from '../../consts';
import type { Structure } from '../types';
import { reachable } from './reachable';
import { structureSurfaces } from './structure-surfaces';

export const structureIsCrossable = (grid: Structure): boolean =>
  chain(structureSurfaces(grid))
    .thru((surfaces) =>
      match({
        entryIndex: findIndex(surfaces, (surface) => surface.col === 0),
        exitIndex: findIndex(
          surfaces,
          (surface) => surface.col === SECTOR_WIDTH - 1,
        ),
      })
        .with(
          { entryIndex: P.number.gte(0), exitIndex: P.number.gte(0) },
          ({ entryIndex, exitIndex }) =>
            reachable(surfaces, entryIndex).has(exitIndex) &&
            reachable(surfaces, exitIndex).has(entryIndex),
        )
        .otherwise(() => false),
    )
    .value();
