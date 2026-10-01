import {
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SPAWN,
  type Tile,
} from '@mander/model';
import { getStructureName, NORMAL_STRUCTURES } from '@mander/structures';
import { createRandom } from '@mander/utils';
import { map, take } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generateChestItems } from '../../items/generate-chest-items';
import { mirrorTiles } from '../../structures/mirror-tiles';
import { createGameLevel } from './create-game-level';
import { getHornedEnemyChance } from './get-horned-enemy-chance';
import { pickRandomLevelSeed } from './pick-random-level-seed';

const STRUCTURES = take([...NORMAL_STRUCTURES], 2);

const FRONT: Tile[][] = [
  [TILE_SPAWN, TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT],
];

const BACK: Tile[][] = [
  [TILE_BRICK, TILE_AIR, TILE_AIR],
  [TILE_AIR, TILE_AIR, TILE_AIR],
];

const createOn = (levelNumber: number) =>
  createGameLevel({
    random: createRandom('DAY-1'),
    levelNumber,
    structures: STRUCTURES,
    tiles: FRONT,
    backTiles: BACK,
  });

describe('createGameLevel', () => {
  it('should turn both layers around when the level is mirrored', () => {
    const level = createOn(3);

    expect(level.tiles).toEqual(mirrorTiles(FRONT));
    expect(level.backTiles).toEqual(mirrorTiles(BACK));
  });

  it('should keep both layers the way they were built when the level is not mirrored', () => {
    const level = createOn(1);

    expect(level.tiles).toBe(FRONT);
    expect(level.backTiles).toBe(BACK);
  });

  it('should measure the level off the front layer when it creates it', () => {
    const level = createOn(1);

    expect(level.width).toBe(3);
    expect(level.height).toBe(2);
  });

  it('should fill the chest from the generator after it picks the level seed', () => {
    const random = createRandom('DAY-1');

    pickRandomLevelSeed(random);

    expect(createOn(1).chestItems).toEqual(generateChestItems(random));
  });

  it('should send out the horned enemies the level allows when it creates it', () => {
    expect(
      map([1, 4, 7], (levelNumber) => createOn(levelNumber).hornedEnemyChance),
    ).toEqual(map([1, 4, 7], getHornedEnemyChance));
  });

  it('should leave the sides open when the level is vertical', () => {
    expect(createOn(2).isOpenSided).toBe(true);
  });

  it('should wall the sides in when the level is horizontal', () => {
    expect(createOn(1).isOpenSided).toBe(false);
  });

  it('should record the structures when it creates the level', () => {
    expect(createOn(1).meta).toEqual({
      structures: map(STRUCTURES, getStructureName),
    });
  });

  it('should pick the level seed from the generator when it creates the level', () => {
    expect(createOn(1).seed).toBe(pickRandomLevelSeed(createRandom('DAY-1')));
  });

  it('should measure an empty level as nothing when the grid is empty', () => {
    const level = createGameLevel({
      random: createRandom('DAY-1'),
      levelNumber: 1,
      structures: [],
      tiles: [],
      backTiles: [],
    });

    expect(level.width).toBe(0);
    expect(level.height).toBe(0);
  });
});
