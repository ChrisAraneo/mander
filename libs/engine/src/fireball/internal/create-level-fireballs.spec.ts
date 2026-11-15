import { createRandom } from '@mander/common';
import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_ICEBALL,
  TILE_PINKBALL,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createLevelFireballs } from './create-level-fireballs';

const SEED = 'SEED';

const OTHER_SEED = 'OTHER';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: SEED,
  width: size(head(tiles)),
  height: size(tiles),
  tiles,
  chestItems: [],
});

const EMPTY_LEVEL = createLevel([
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
]);

const MIXED_LEVEL = createLevel([
  [TILE_FIREBALL, TILE_ICEBALL, TILE_PINKBALL],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT],
]);

describe('createLevelFireballs', () => {
  it('should light no balls when the level holds no ball blocks', () => {
    expect(createLevelFireballs(EMPTY_LEVEL, createRandom(SEED))).toEqual([]);
  });

  it('should light a ball for every ball block when the level holds all three kinds', () => {
    expect(
      map(
        createLevelFireballs(MIXED_LEVEL, createRandom(SEED)),
        (fireball) => fireball.kind,
      ),
    ).toEqual(['FIRE', 'ICE', 'PINK', 'PINK']);
  });

  it('should light the same balls again when it is given the same seed', () => {
    expect(createLevelFireballs(MIXED_LEVEL, createRandom(SEED))).toEqual(
      createLevelFireballs(MIXED_LEVEL, createRandom(SEED)),
    );
  });

  it('should send the balls round other ways when it is given another seed', () => {
    expect(
      map(
        createLevelFireballs(MIXED_LEVEL, createRandom(SEED)),
        (fireball) => fireball.spin,
      ),
    ).not.toEqual(
      map(
        createLevelFireballs(MIXED_LEVEL, createRandom(OTHER_SEED)),
        (fireball) => fireball.spin,
      ),
    );
  });

  it('should leave the level unchanged when it lights the balls', () => {
    const level = createLevel([
      [TILE_FIREBALL, TILE_ICEBALL, TILE_PINKBALL],
      [TILE_DIRT, TILE_DIRT, TILE_DIRT],
    ]);

    createLevelFireballs(level, createRandom(SEED));

    expect(level).toEqual(MIXED_LEVEL);
  });
});
