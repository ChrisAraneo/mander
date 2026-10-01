import {
  NORMAL_STRUCTURES,
  type Sector,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { take } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { joinStructures } from '../../structures/layout/join-structures';
import { joinLevelStructures } from './join-level-structures';

const ACROSS: Sector[] = take([...NORMAL_STRUCTURES], 2);

const UPWARD: Sector[] = take([...VERTICAL_STRUCTURES], 2);

describe('joinLevelStructures', () => {
  it('should mark the level horizontal when it is the first of the day', () => {
    expect(
      joinLevelStructures({ seed: 'SEED', levelNumber: 1, structures: [] })
        .levelType,
    ).toBe('HORIZONTAL');
  });

  it('should mark the level vertical when it is the second of the day', () => {
    expect(
      joinLevelStructures({ seed: 'SEED', levelNumber: 2, structures: [] })
        .levelType,
    ).toBe('VERTICAL');
  });

  it('should join the structures across in a horizontal level when it lays them out', () => {
    const { tiles, backTiles } = joinLevelStructures({
      seed: 'SEED',
      levelNumber: 1,
      structures: ACROSS,
    });

    expect({ tiles, backTiles }).toEqual(joinStructures(ACROSS, 'HORIZONTAL'));
  });

  it('should stack the structures up in a vertical level when it lays them out', () => {
    const { tiles, backTiles } = joinLevelStructures({
      seed: 'SEED',
      levelNumber: 2,
      structures: UPWARD,
    });

    expect({ tiles, backTiles }).toEqual(joinStructures(UPWARD, 'VERTICAL'));
  });

  it('should give back two empty layers when there are no structures', () => {
    const { tiles, backTiles } = joinLevelStructures({
      seed: 'SEED',
      levelNumber: 1,
      structures: [],
    });

    expect(tiles).toEqual([]);
    expect(backTiles).toEqual([]);
  });

  it('should pass the seed on when it lays the structures out', () => {
    expect(
      joinLevelStructures({ seed: 'SEED', levelNumber: 1, structures: [] })
        .seed,
    ).toBe('SEED');
  });

  it('should pass the level number on when it lays the structures out', () => {
    expect(
      joinLevelStructures({ seed: 'SEED', levelNumber: 3, structures: [] })
        .levelNumber,
    ).toBe(3);
  });

  it('should pass the structures on when it lays them out', () => {
    expect(
      joinLevelStructures({ seed: 'SEED', levelNumber: 1, structures: ACROSS })
        .structures,
    ).toBe(ACROSS);
  });
});
