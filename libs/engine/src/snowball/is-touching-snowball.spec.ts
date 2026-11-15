import {
  type Player,
  type Snowball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
import type { GameLevel } from '../state/types/game-level';
import { SNOWBALL_SPEED } from './consts';
import { isTouchingSnowball } from './is-touching-snowball';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const PLAYER_X = 100;

const PLAYER_Y = 100;

const PLAYER: Player = {
  ...createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } }),
  position: { x: PLAYER_X, y: PLAYER_Y },
};

const OVER_THE_PLAYER_X = 105;

const JUST_INSIDE_THE_LEFT_X = 95;

const JUST_OUTSIDE_THE_LEFT_X = 94;

const JUST_OUTSIDE_THE_RIGHT_X = 116;

const FAR_AWAY_X = 300;

const FAR_AWAY_Y = 300;

const INSIDE_THE_PLAYER_Y = 120;

const JUST_ABOVE_THE_HEAD_Y = 92;

const JUST_BELOW_THE_FEET_Y = 146;

const createSnowballAt = (left: number, top: number): Snowball => ({
  position: { x: left, y: top },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
});

describe('isTouchingSnowball', () => {
  it('should say yes when the snowball flies into the player', () => {
    const isTouching = isTouchingSnowball(
      PLAYER,
      createSnowballAt(OVER_THE_PLAYER_X, INSIDE_THE_PLAYER_Y),
    );

    expect(isTouching).toBe(true);
  });

  it('should say yes when the snowball just reaches past the left edge of the player', () => {
    const isTouching = isTouchingSnowball(
      PLAYER,
      createSnowballAt(JUST_INSIDE_THE_LEFT_X, INSIDE_THE_PLAYER_Y),
    );

    expect(isTouching).toBe(true);
  });

  it('should say no when the snowball is far from the player', () => {
    const isTouching = isTouchingSnowball(
      PLAYER,
      createSnowballAt(FAR_AWAY_X, FAR_AWAY_Y),
    );

    expect(isTouching).toBe(false);
  });

  it('should say no when the snowball only meets the left edge of the player', () => {
    const isTouching = isTouchingSnowball(
      PLAYER,
      createSnowballAt(JUST_OUTSIDE_THE_LEFT_X, INSIDE_THE_PLAYER_Y),
    );

    expect(isTouching).toBe(false);
  });

  it('should say no when the snowball only meets the right edge of the player', () => {
    const isTouching = isTouchingSnowball(
      PLAYER,
      createSnowballAt(JUST_OUTSIDE_THE_RIGHT_X, INSIDE_THE_PLAYER_Y),
    );

    expect(isTouching).toBe(false);
  });

  it('should say no when the snowball only meets the top of the player', () => {
    const isTouching = isTouchingSnowball(
      PLAYER,
      createSnowballAt(OVER_THE_PLAYER_X, JUST_ABOVE_THE_HEAD_Y),
    );

    expect(isTouching).toBe(false);
  });

  it('should say no when the snowball only meets the feet of the player', () => {
    const isTouching = isTouchingSnowball(
      PLAYER,
      createSnowballAt(OVER_THE_PLAYER_X, JUST_BELOW_THE_FEET_Y),
    );

    expect(isTouching).toBe(false);
  });
  it('should leave the player and the snowball it was handed untouched when they meet', () => {
    const player: Player = { ...PLAYER, position: { ...PLAYER.position } };
    const snowball = createSnowballAt(OVER_THE_PLAYER_X, INSIDE_THE_PLAYER_Y);

    isTouchingSnowball(player, snowball);

    expect(player).toEqual(PLAYER);
    expect(snowball).toEqual(
      createSnowballAt(OVER_THE_PLAYER_X, INSIDE_THE_PLAYER_Y),
    );
  });
});
