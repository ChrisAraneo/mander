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
import { nextFreezers } from '../../enemy/next-freezers';
import { nextFallingSpikes } from '../../falling-spike/next-falling-spikes';
import { nextFireballs } from '../../fireball/next-fireballs';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { nextSnowballs } from '../../snowball/next-snowballs';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { createMovedTickHazardSet } from './create-moved-tick-hazard-set';
import { patchMovedBarrage } from './patch-moved-barrage';
import { patchMovedSalvo } from './patch-moved-salvo';
import type { MovedBlizzard } from './types/moved-blizzard';

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

const BARE_LEVEL = createLevel([
  '........',
  '........',
  's.......',
  '########',
]);

const DELTA_SECONDS = 0.02;

const PLAYER_X = 120;

const PLAYER_Y = 32;

const CANNONBALL_X = 100;

const CANNONBALL_Y = 10;

const CANNONBALL_SPEED = 200;

const BULLET_X = 50;

const BULLET_Y = 60;

const BULLET_SPEED = 300;

const createCannonball = (): Cannonball => ({
  position: { x: CANNONBALL_X, y: CANNONBALL_Y },
  velocity: {
    x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
    y: { current: 0, max: CANNONBALL_SPEED },
  },
});

const createBullet = (): Bullet => ({
  position: { x: BULLET_X, y: BULLET_Y },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

const createState = (level: GameLevel): GameState => ({
  ...createInitialState(level, FIRST_LEVEL_INDEX, []),
  cannonballs: [createCannonball()],
  bullets: [createBullet()],
});

const createMovedPlayer = (level: GameLevel): Player => ({
  ...createInitialState(level, FIRST_LEVEL_INDEX, []).player,
  position: { x: PLAYER_X, y: PLAYER_Y },
});

const createMovedBlizzard = (level: GameLevel): MovedBlizzard => ({
  state: createState(level),
  player: createMovedPlayer(level),
  deltaSeconds: DELTA_SECONDS,
  salvo: patchMovedSalvo(
    createState(level),
    createMovedPlayer(level),
    DELTA_SECONDS,
  ),
  blizzard: nextFreezers(
    patchMovedSalvo(createState(level), createMovedPlayer(level), DELTA_SECONDS)
      .enemies,
    createMovedPlayer(level),
    DELTA_SECONDS,
  ),
});

describe('createMovedTickHazardSet', () => {
  it('should gather the hazards their own advance steps give when the hazards have moved', () => {
    const moved = createMovedBlizzard(LEVEL);

    const hazards = createMovedTickHazardSet(moved);

    expect(hazards).toEqual({
      steppedEnemies: moved.blizzard.enemies,
      cannons: patchMovedBarrage(moved.state, moved.player, DELTA_SECONDS)
        .cannons,
      cannonballs: patchMovedBarrage(moved.state, moved.player, DELTA_SECONDS)
        .cannonballs,
      snowballs: nextSnowballs(moved.state.snowballs, LEVEL, DELTA_SECONDS),
      fallingSpikes: nextFallingSpikes(
        LEVEL,
        moved.state.fallingSpikes,
        moved.player,
        DELTA_SECONDS,
      ),
      fireballs: nextFireballs(moved.state.fireballs, DELTA_SECONDS),
      flyingBullets: nextBullets(moved.state.bullets, LEVEL, DELTA_SECONDS),
    });
  });

  it('should give no enemies, cannons, snowballs, falling spikes or fireballs when the level holds none', () => {
    const hazards = createMovedTickHazardSet(createMovedBlizzard(BARE_LEVEL));

    expect(hazards.steppedEnemies).toEqual([]);
    expect(hazards.cannons).toEqual([]);
    expect(hazards.snowballs).toEqual([]);
    expect(hazards.fallingSpikes).toEqual([]);
    expect(hazards.fireballs).toEqual([]);
  });

  it('should leave the moved hazards it was handed untouched when it gathers them', () => {
    const moved = createMovedBlizzard(LEVEL);

    createMovedTickHazardSet(moved);

    expect(moved).toEqual(createMovedBlizzard(LEVEL));
  });
});
