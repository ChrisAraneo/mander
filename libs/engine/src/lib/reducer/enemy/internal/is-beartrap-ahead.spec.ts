import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { isBeartrapAhead } from './is-beartrap-ahead';

const WIDTH = 20;

const HEIGHT = 14;

const FLOOR_ROW = 12;

const TRAP_ROW = FLOOR_ROW - 1;

const TRAP_COLUMN = 6;

const TRAP_Y = FLOOR_ROW * TILE_SIZE - ENEMY_HEIGHT;

const UP_TO_TRAP_FROM_LEFT = TRAP_COLUMN * TILE_SIZE - ENEMY_WIDTH;

const UP_TO_TRAP_FROM_RIGHT = (TRAP_COLUMN + 1) * TILE_SIZE;

const createRoom = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row): Tile[] =>
    times(WIDTH, (column) =>
      match({
        isFloor: row >= FLOOR_ROW,
        isTrap: row === TRAP_ROW && column === TRAP_COLUMN,
      })
        .with({ isFloor: true }, (): Tile => TILE_DIRT)
        .with({ isTrap: true }, (): Tile => TILE_BEARTRAP)
        .otherwise((): Tile => TILE_AIR),
    ),
  ),
  chestItems: [],
});

describe('isBeartrapAhead', () => {
  it('should see the trap when the enemy walking right is about to step into it', () => {
    expect(isBeartrapAhead(createRoom(), UP_TO_TRAP_FROM_LEFT, TRAP_Y, 1)).toBe(
      true,
    );
  });

  it('should see the trap when the enemy walking left is about to step into it', () => {
    expect(
      isBeartrapAhead(createRoom(), UP_TO_TRAP_FROM_RIGHT, TRAP_Y, -1),
    ).toBe(true);
  });

  it('should see nothing when the enemy is walking away from the trap', () => {
    expect(
      isBeartrapAhead(createRoom(), UP_TO_TRAP_FROM_LEFT, TRAP_Y, -1),
    ).toBe(false);
  });

  it('should see nothing when the floor ahead is open across the room', () => {
    expect(isBeartrapAhead(createRoom(), 0, TRAP_Y, 1)).toBe(false);
  });

  it('should see nothing when the room holds no such tile', () => {
    const bare = createRoom();
    bare.tiles[TRAP_ROW][TRAP_COLUMN] = TILE_AIR;

    expect(isBeartrapAhead(bare, UP_TO_TRAP_FROM_LEFT, TRAP_Y, 1)).toBe(false);
  });
});
