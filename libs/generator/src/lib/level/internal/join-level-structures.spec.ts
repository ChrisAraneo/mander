import {
  NORMAL_STRUCTURES,
  type Sector,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { createRandom } from '@mander/utils';
import { take } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { joinStructures } from '../../layout/join-structures';
import { joinLevelStructures } from './join-level-structures';

const RANDOM = createRandom('SEED');

const ACROSS: Sector[] = take([...NORMAL_STRUCTURES], 2);

const UPWARD: Sector[] = take([...VERTICAL_STRUCTURES], 2);

describe('joinLevelStructures', () => {
  it('should mark the level horizontal when it is the first of the day', () => {
    expect(
      joinLevelStructures({ levelNumber: 1, structures: [], random: RANDOM })
        .levelType,
    ).toBe('HORIZONTAL');
  });

  it('should mark the level vertical when it is the second of the day', () => {
    expect(
      joinLevelStructures({ levelNumber: 2, structures: [], random: RANDOM })
        .levelType,
    ).toBe('VERTICAL');
  });

  it('should join the structures across in a horizontal level when it lays them out', () => {
    const { tiles, backTiles } = joinLevelStructures({
      levelNumber: 1,
      structures: ACROSS,
      random: RANDOM,
    });

    expect({ tiles, backTiles }).toEqual(joinStructures(ACROSS, 'HORIZONTAL'));
  });

  it('should stack the structures up in a vertical level when it lays them out', () => {
    const { tiles, backTiles } = joinLevelStructures({
      levelNumber: 2,
      structures: UPWARD,
      random: RANDOM,
    });

    expect({ tiles, backTiles }).toEqual(joinStructures(UPWARD, 'VERTICAL'));
  });

  it('should give back two empty layers when there are no structures', () => {
    const { tiles, backTiles } = joinLevelStructures({
      levelNumber: 1,
      structures: [],
      random: RANDOM,
    });

    expect(tiles).toEqual([]);
    expect(backTiles).toEqual([]);
  });

  it('should pass the generator on when it lays the structures out', () => {
    expect(
      joinLevelStructures({ levelNumber: 1, structures: [], random: RANDOM })
        .random,
    ).toBe(RANDOM);
  });

  it('should pass the level number on when it lays the structures out', () => {
    expect(
      joinLevelStructures({ levelNumber: 3, structures: [], random: RANDOM })
        .levelNumber,
    ).toBe(3);
  });

  it('should pass the structures on when it lays them out', () => {
    expect(
      joinLevelStructures({
        levelNumber: 1,
        structures: ACROSS,
        random: RANDOM,
      }).structures,
    ).toBe(ACROSS);
  });
});
