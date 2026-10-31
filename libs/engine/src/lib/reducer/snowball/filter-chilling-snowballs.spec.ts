import {
  type Player,
  type Snowball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
import { SNOWBALL_SPEED } from './consts';
import { filterChillingSnowballs } from './filter-chilling-snowballs';

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

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerWithInvincibility = (invincibility: number): Player => ({
  ...BASE_PLAYER,
  position: { x: 100, y: 100 },
  timers: { ...BASE_PLAYER.timers, invincibility },
});

const createSnowballAt = (left: number, top: number): Snowball => ({
  position: { x: left, y: top },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
});

const createSnowballs = (): Snowball[] => [
  createSnowballAt(300, 300),
  createSnowballAt(105, 120),
  createSnowballAt(0, 0),
  createSnowballAt(110, 130),
];

describe('filterChillingSnowballs', () => {
  it('should give the snowballs that land on the player when they hit', () => {
    const player = createPlayerWithInvincibility(0);
    const snowballs = createSnowballs();

    const chilling = filterChillingSnowballs(player, snowballs);

    expect(chilling).toEqual([snowballs[1], snowballs[3]]);
    expect(chilling[0]).toBe(snowballs[1]);
  });

  it('should still give the snowballs that land when the player is invincible, since the cold is no wound', () => {
    const player = createPlayerWithInvincibility(1);
    const snowballs = createSnowballs();

    const chilling = filterChillingSnowballs(player, snowballs);

    expect(chilling).toEqual([snowballs[1], snowballs[3]]);
  });

  it('should give no snowballs when none of them lands on the player', () => {
    const player = createPlayerWithInvincibility(0);

    const chilling = filterChillingSnowballs(player, [
      createSnowballAt(300, 300),
      createSnowballAt(0, 0),
    ]);

    expect(chilling).toEqual([]);
  });

  it('should give no snowballs when there are no snowballs in flight', () => {
    const player = createPlayerWithInvincibility(0);

    expect(filterChillingSnowballs(player, [])).toEqual([]);
  });

  it('should leave the player and the snowballs alone when it picks the hits', () => {
    const player = createPlayerWithInvincibility(0);
    const snowballs = createSnowballs();

    filterChillingSnowballs(player, snowballs);

    expect(player).toEqual(createPlayerWithInvincibility(0));
    expect(snowballs).toEqual(createSnowballs());
  });
});
