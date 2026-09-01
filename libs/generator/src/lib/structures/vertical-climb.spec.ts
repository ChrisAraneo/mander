import { checkPlayerReach, isReachableCell } from '@mander/engine';
import { findTile, type Level, TILE_PORTAL } from '@mander/model';
import { type Structure, VERTICAL_STRUCTURES } from '@mander/structures';
import { filter, includes, join, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { VERTICAL_LEVELS } from '../consts';
import { generate } from '../generate';
import { addPadding } from './add-padding';
import { addVerticalPortal } from './add-vertical-portal';
import { addVerticalSpawn } from './add-vertical-spawn';
import { stackStructures } from './stack-structures';

const SECTORS = 2;

const dayOf = (day: number): Date => new Date(Date.UTC(2026, 0, 1 + day));

const named = (index: number): string =>
  `VERTICAL_${String(index + 1).padStart(3, '0')}`;

const twoUp = (structure: Structure): Level => {
  const tiles = addPadding(
    addVerticalPortal(
      addVerticalSpawn(stackStructures(times(SECTORS, () => structure))),
    ),
  );

  return {
    seed: 'CLIMB',
    width: size(tiles[0]),
    height: size(tiles),
    tiles,
    chestItems: [],
  };
};

const isPortalReached = (level: Level): boolean => {
  const portal = findTile(level, TILE_PORTAL);
  const reach = checkPlayerReach(level);

  return portal !== null && isReachableCell(reach, portal.y + 1, portal.x);
};

const verticalLevels = (date: Date): Level[] =>
  filter(generate(date).levels, (_, index) =>
    includes(VERTICAL_LEVELS, index + 1),
  );

describe('the climb up a vertical level', () => {
  it('carries the player from the ground of one sector out of the top of the next', () => {
    const stuck = filter(
      map(VERTICAL_STRUCTURES, (structure, index) => ({
        name: named(index),
        isClimbed: isPortalReached(twoUp(structure)),
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

  it('reaches the portal of every level the generator stands up', () => {
    const lost = filter(
      map(verticalLevels(dayOf(0)), (level, index) => ({
        level: index,
        isReached: isPortalReached(level),
      })),
      ({ isReached }) => !isReached,
    );

    expect(map(lost, ({ level }) => level)).toEqual([]);
  }, 120000);
});
