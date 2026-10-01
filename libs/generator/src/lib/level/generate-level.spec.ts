import { findTile, TILE_PORTAL, TILE_SPAWN } from '@mander/model';
import {
  NORMAL_STRUCTURES,
  type Sector,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { createRandom } from '@mander/utils';
import { map, size, take } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { STRUCTURES_PER_LEVEL } from '../consts';
import { generateLevel } from './generate-level';

const SEED = 'DAY-1';

const ACROSS: Sector[] = take([...NORMAL_STRUCTURES], STRUCTURES_PER_LEVEL);

const UPWARD: Sector[] = take([...VERTICAL_STRUCTURES], STRUCTURES_PER_LEVEL);

describe('generateLevel', () => {
  it('should lay down a way in and a way out in a horizontal level when it builds one', () => {
    const level = generateLevel(1, ACROSS, createRandom(SEED));

    expect(findTile(level, TILE_SPAWN)).not.toBeNull();
    expect(findTile(level, TILE_PORTAL)).not.toBeNull();
  });

  it('should lay down a way in and a way out in a vertical level when it builds one', () => {
    const level = generateLevel(2, UPWARD, createRandom(SEED));

    expect(findTile(level, TILE_SPAWN)).not.toBeNull();
    expect(findTile(level, TILE_PORTAL)).not.toBeNull();
  });

  it('should send the player in from the left when the level is not mirrored', () => {
    const level = generateLevel(1, ACROSS, createRandom(SEED));

    const spawn = findTile(level, TILE_SPAWN);
    const portal = findTile(level, TILE_PORTAL);

    expect((spawn?.x ?? 0) < (portal?.x ?? 0)).toBe(true);
  });

  it('should send the player in from the right when the level is mirrored', () => {
    const level = generateLevel(3, ACROSS, createRandom(SEED));

    const spawn = findTile(level, TILE_SPAWN);
    const portal = findTile(level, TILE_PORTAL);

    expect((spawn?.x ?? 0) > (portal?.x ?? 0)).toBe(true);
  });

  it('should send the player up when the level is vertical', () => {
    const level = generateLevel(2, UPWARD, createRandom(SEED));

    const spawn = findTile(level, TILE_SPAWN);
    const portal = findTile(level, TILE_PORTAL);

    expect((spawn?.y ?? 0) > (portal?.y ?? 0)).toBe(true);
  });

  it('should measure the level off its grid when it builds one', () => {
    const level = generateLevel(1, ACROSS, createRandom(SEED));

    expect(level.width).toBe(size(level.tiles[0]));
    expect(level.height).toBe(size(level.tiles));
  });

  it('should cut the back layer to the shape of the front when it builds a level', () => {
    const level = generateLevel(2, UPWARD, createRandom(SEED));

    expect(map(level.backTiles, size)).toEqual(map(level.tiles, size));
  });

  it('should build the level the same way twice when the generator starts from the same seed and it gets the same structures', () => {
    expect(generateLevel(4, ACROSS, createRandom(SEED))).toEqual(
      generateLevel(4, ACROSS, createRandom(SEED)),
    );
  });

  it('should fill the chest another way when the generator starts from another seed', () => {
    expect(generateLevel(1, ACROSS, createRandom(SEED)).chestItems).not.toEqual(
      generateLevel(1, ACROSS, createRandom('OTHER-SEED')).chestItems,
    );
  });

  it('should give back an empty level when there are no structures', () => {
    const level = generateLevel(1, [], createRandom(SEED));

    expect(level.tiles).toEqual([]);
    expect(level.width).toBe(0);
    expect(level.height).toBe(0);
  });
});
