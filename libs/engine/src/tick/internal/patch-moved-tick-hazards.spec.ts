import {
  type Bullet,
  type Cannonball,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { nextBullets } from '../../bullet/next-bullets';
import { createPatrol } from '../../enemy/create-patrol';
import { nextFallingSpikes } from '../../falling-spike/next-falling-spikes';
import { nextFireballs } from '../../fireball/next-fireballs';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { nextSnowballs } from '../../snowball/next-snowballs';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchMovedBarrage } from './patch-moved-barrage';
import { patchMovedEnemies } from './patch-moved-enemies';
import { patchMovedTickHazards } from './patch-moved-tick-hazards';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  c: TILE_CANNON,
  e: TILE_ENEMY,
  f: TILE_FIREBALL,
  s: TILE_SPAWN,
  v: TILE_SPIKE_FALLING,
};

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

const LEVEL = createLevel(['..c.....', '...v..f.', 's...e...', '########']);

const DELTA_SECONDS = 0.02;

const createCannonball = (): Cannonball => ({
  position: { x: 100, y: 10 },
  velocity: { x: { current: 200, max: 200 }, y: { current: 0, max: 200 } },
});

const createBullet = (): Bullet => ({
  position: { x: 50, y: 60 },
  velocity: { x: { current: 300, max: 300 } },
});

const createState = (): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  cannonballs: [createCannonball()],
  bullets: [createBullet()],
});

const createMovedPlayer = (): Player => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []).player,
  position: { x: 120, y: 32 },
});

describe('patchMovedTickHazards', () => {
  it('should give the hazards their own advance steps give when the hazards move for a tick', () => {
    const state = createState();
    const player = createMovedPlayer();

    const hazards = patchMovedTickHazards(state, player, DELTA_SECONDS);

    expect(hazards).toEqual({
      steppedEnemies: patchMovedEnemies(state, player, DELTA_SECONDS),
      cannons: patchMovedBarrage(state, player, DELTA_SECONDS).cannons,
      cannonballs: patchMovedBarrage(state, player, DELTA_SECONDS).cannonballs,
      snowballs: nextSnowballs(state.snowballs, LEVEL, DELTA_SECONDS),
      fallingSpikes: nextFallingSpikes(
        LEVEL,
        state.fallingSpikes,
        player,
        DELTA_SECONDS,
      ),
      fireballs: nextFireballs(state.fireballs, DELTA_SECONDS),
      flyingBullets: nextBullets(state.bullets, LEVEL, DELTA_SECONDS),
    });
  });

  it('should add the cannonballs the shooters fire to the flying ones when a loaded shooter has the player in range', () => {
    const state = {
      ...createState(),
      enemies: [
        {
          ...createPatrol({ x: 128, y: 64 }, 'SHOOTER'),
          timers: { death: null, reload: 0 },
          statuses: { isFacingRight: true, isGrounded: true },
        },
      ],
    };
    const player = createMovedPlayer();

    const hazards = patchMovedTickHazards(state, player, DELTA_SECONDS);

    expect(size(hazards.cannonballs)).toBe(
      size(patchMovedBarrage(state, player, DELTA_SECONDS).cannonballs) + 1,
    );
  });

  it('should add the snowballs the freezing enemies throw to the flying ones when a loaded one has the player in range', () => {
    const state = {
      ...createState(),
      enemies: [
        {
          ...createPatrol({ x: 128, y: 64 }, 'FREEZING'),
          timers: { death: null, reload: 0 },
          statuses: { isFacingRight: true, isGrounded: true },
        },
      ],
    };
    const player = createMovedPlayer();

    const hazards = patchMovedTickHazards(state, player, DELTA_SECONDS);

    expect(size(hazards.snowballs)).toBe(1);
  });

  it('should leave the given game alone when the hazards move for a tick', () => {
    const state = createState();

    patchMovedTickHazards(state, createMovedPlayer(), DELTA_SECONDS);

    expect(state).toEqual(createState());
  });
});
