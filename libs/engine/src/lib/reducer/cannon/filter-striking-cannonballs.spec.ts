import {
  type Cannonball,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
import { CANNONBALL_SPEED } from './consts';
import { filterStrikingCannonballs } from './filter-striking-cannonballs';

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

const createCannonballAt = (left: number, top: number): Cannonball => ({
  position: { x: left, y: top },
  velocity: { x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED } },
});

const createCannonballs = (): Cannonball[] => [
  createCannonballAt(300, 300),
  createCannonballAt(105, 120),
  createCannonballAt(0, 0),
  createCannonballAt(110, 130),
];

describe('filterStrikingCannonballs', () => {
  it('should give the cannonballs that hit the player when the player can be hurt', () => {
    const player = createPlayerWithInvincibility(0);
    const cannonballs = createCannonballs();

    const striking = filterStrikingCannonballs(player, cannonballs);

    expect(striking).toEqual([cannonballs[1], cannonballs[3]]);
    expect(striking[0]).toBe(cannonballs[1]);
  });

  it('should give no cannonballs when the player is invincible even though some hit', () => {
    const player = createPlayerWithInvincibility(1);

    const striking = filterStrikingCannonballs(player, createCannonballs());

    expect(striking).toEqual([]);
  });

  it('should give no cannonballs when none of them hits the player', () => {
    const player = createPlayerWithInvincibility(0);
    const cannonballs = [
      createCannonballAt(300, 300),
      createCannonballAt(0, 0),
    ];

    const striking = filterStrikingCannonballs(player, cannonballs);

    expect(striking).toEqual([]);
  });

  it('should give no cannonballs when there are no cannonballs in flight', () => {
    const player = createPlayerWithInvincibility(0);

    const striking = filterStrikingCannonballs(player, []);

    expect(striking).toEqual([]);
  });

  it('should leave the player and the cannonballs alone when it picks the hits', () => {
    const player = createPlayerWithInvincibility(0);
    const cannonballs = createCannonballs();

    filterStrikingCannonballs(player, cannonballs);

    expect(player).toEqual(createPlayerWithInvincibility(0));
    expect(cannonballs).toEqual(createCannonballs());
  });
});
