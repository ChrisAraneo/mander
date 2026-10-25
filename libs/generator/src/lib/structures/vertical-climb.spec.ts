import { checkPlayerReach, isReachableCell } from '@mander/engine';
import { findTile, type Level, TILE_PORTAL } from '@mander/model';
import {
  type VerticalStructure,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import {
  filter,
  isNull,
  join,
  map,
  padStart,
  size,
  times,
  toString,
} from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createWorld } from '../create-world';
import { createStructureLayers } from '../layout/create-structure-layers';
import { addPadding } from '../padding/add-padding';
import { addPlayerSpawn } from '../player-spawn/add-player-spawn';
import { addPortal } from '../portal/add-portal';

const SECTORS = 2;

const createDate = (day: number): Date => new Date(Date.UTC(2026, 0, 1 + day));

const formatStructureName = (index: number): string =>
  `VERTICAL_${padStart(toString(index + 1), 3, '0')}`;

const createClimb = (structure: VerticalStructure): Level =>
  pipe(
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
    addPadding,
    (tiles) => ({
      seed: 'CLIMB',
      width: size(tiles[0]),
      height: size(tiles),
      tiles,
      chestItems: [],
    }),
  );

const isPortalReached = (level: Level): boolean =>
  pipe(
    level,
    (climb) => ({
      portal: findTile(climb, TILE_PORTAL),
      reach: checkPlayerReach(climb),
    }),
    ({ portal, reach }) =>
      !isNull(portal) && isReachableCell(reach, portal.y + 1, portal.x),
  );

const filterVerticalLevels = (date: Date): Level[] =>
  filter(createWorld(date).levels, (level) => level.isOpenSided === true);

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
