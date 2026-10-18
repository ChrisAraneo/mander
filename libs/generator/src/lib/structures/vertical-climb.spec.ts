import { checkPlayerReach, isReachableCell } from '@mander/engine';
import { findTile, type Level, TILE_PORTAL, chain } from '@mander/model';
import {
  type VerticalStructure,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import {
  filter,
  includes,
  isNull,
  join,
  map,
  padStart,
  size,
  times,
  toString,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { VERTICAL_LEVELS } from '../consts';
import { generate } from '../generate';
import { createStructureLayers } from '../layout/create-structure-layers';
import { addPadding } from '../padding/add-padding';
import { addPlayerSpawn } from '../player-spawn/add-player-spawn';
import { addPortal } from '../portal/add-portal';

const SECTORS = 2;

const createDate = (day: number): Date => new Date(Date.UTC(2026, 0, 1 + day));

const formatStructureName = (index: number): string =>
  `VERTICAL_${padStart(toString(index + 1), 3, '0')}`;

const createClimb = (structure: VerticalStructure): Level =>
  chain(
    addPadding(
      addPortal(
        addPlayerSpawn(
          createStructureLayers(
            times(SECTORS, () => structure),
            'VERTICAL',
          ).tiles,
          'VERTICAL',
        ),
        'VERTICAL',
      ),
    ),
  )
    .thru((tiles) => ({
      seed: 'CLIMB',
      width: size(tiles[0]),
      height: size(tiles),
      tiles,
      chestItems: [],
    }))
    .value();

const isPortalReached = (level: Level): boolean =>
  chain({
    portal: findTile(level, TILE_PORTAL),
    reach: checkPlayerReach(level),
  })
    .thru(
      ({ portal, reach }) =>
        !isNull(portal) && isReachableCell(reach, portal.y + 1, portal.x),
    )
    .value();

const filterVerticalLevels = (date: Date): Level[] =>
  filter(generate(date).levels, (_, index) =>
    includes(VERTICAL_LEVELS, index + 1),
  );

describe('the climb up a vertical level', () => {
  it('should carry the player out of the top of the next sector when they start on the ground of one', () => {
    const stuck = filter(
      map(VERTICAL_STRUCTURES, (structure, index) => ({
        name: formatStructureName(index),
        isClimbed: isPortalReached(createClimb(structure)),
      })),
      ({ isClimbed }) => !isClimbed,
    );

    expect(
      join(
        map(stuck, ({ name }) => name),
        ', ',
      ),
    ).toBe('');
  }, 120000);

  it('should reach the portal when the generator stands a level up', () => {
    const lost = filter(
      map(filterVerticalLevels(createDate(0)), (level, index) => ({
        level: index,
        isReached: isPortalReached(level),
      })),
      ({ isReached }) => !isReached,
    );

    expect(map(lost, ({ level }) => level)).toEqual([]);
  }, 120000);
});
