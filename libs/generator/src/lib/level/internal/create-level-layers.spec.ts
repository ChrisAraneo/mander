import {
  NORMAL_STRUCTURES,
  type Sector,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { createRandom } from '@mander/utils';
import { take } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createStructureLayers } from '../../layout/create-structure-layers';
import { createLevelLayers } from './create-level-layers';

const RANDOM = createRandom('SEED');

const ACROSS: Sector[] = take([...NORMAL_STRUCTURES], 2);

const UPWARD: Sector[] = take([...VERTICAL_STRUCTURES], 2);

describe('createLevelLayers', () => {
  it('should mark the level horizontal when it is the first of the day', () => {
    expect(
      createLevelLayers({ levelNumber: 1, structures: [], random: RANDOM })
        .levelType,
    ).toBe('HORIZONTAL');
  });

  it('should mark the level vertical when it is the second of the day', () => {
    expect(
      createLevelLayers({ levelNumber: 2, structures: [], random: RANDOM })
        .levelType,
    ).toBe('VERTICAL');
  });

  it('should join the structures across in a horizontal level when it lays them out', () => {
    const { tiles, backTiles } = createLevelLayers({
      levelNumber: 1,
      structures: ACROSS,
      random: RANDOM,
    });

    expect({ tiles, backTiles }).toEqual(
      createStructureLayers(ACROSS, 'HORIZONTAL'),
    );
  });

  it('should stack the structures up in a vertical level when it lays them out', () => {
    const { tiles, backTiles } = createLevelLayers({
      levelNumber: 2,
      structures: UPWARD,
      random: RANDOM,
    });

    expect({ tiles, backTiles }).toEqual(
      createStructureLayers(UPWARD, 'VERTICAL'),
    );
  });

  it('should give back two empty layers when there are no structures', () => {
    const { tiles, backTiles } = createLevelLayers({
      levelNumber: 1,
      structures: [],
      random: RANDOM,
    });

    expect(tiles).toEqual([]);
    expect(backTiles).toEqual([]);
  });

  it('should pass the generator on when it lays the structures out', () => {
    expect(
      createLevelLayers({ levelNumber: 1, structures: [], random: RANDOM })
        .random,
    ).toBe(RANDOM);
  });

  it('should pass the level number on when it lays the structures out', () => {
    expect(
      createLevelLayers({ levelNumber: 3, structures: [], random: RANDOM })
        .levelNumber,
    ).toBe(3);
  });

  it('should pass the structures on when it lays them out', () => {
    expect(
      createLevelLayers({
        levelNumber: 1,
        structures: ACROSS,
        random: RANDOM,
      }).structures,
    ).toBe(ACROSS);
  });
});
