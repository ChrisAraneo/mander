import {
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, nth, size, take } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { fireBullet } from '../../bullet/fire-bullet';
import { resolveVolley } from '../../bullet/resolve-volley';
import { computeTickHarm } from './compute-tick-harm';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { computeTickVolley } from './compute-tick-volley';
import { patchStruckEnemies } from './patch-struck-enemies';
import type { TickHarm } from './types/tick-harm';

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
});

const LEVEL = createLevel([
  '..c.......',
  '...v..f...',
  's...e...e.',
  '##########',
]);

const DELTA_SECONDS = 0.02;

const BASE_STATE = createInitialState(LEVEL, 0, []);

const createState = (): GameState => ({
  ...BASE_STATE,
  input: { isLeft: false, isRight: true, isJump: false },
  bullets: [fireBullet(BASE_STATE.player)],
});

const createTickHarm = (): TickHarm =>
  computeTickHarm(
    computeTickStomps(
      computeTickHazards(
        computeTickPlayer({
          state: createState(),
          deltaSeconds: DELTA_SECONDS,
        }),
      ),
    ),
  );

describe('computeTickVolley', () => {
  it('should give the bullets, the shot enemies, the unshot falling spikes and the level after the bullets fly when the player shoots', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect({
      bullets: volley.bullets,
      enemies: volley.shot,
      fallingSpikes: volley.unshot,
      level: volley.level,
    }).toEqual(
      resolveVolley(
        tick.flyingBullets,
        patchStruckEnemies(tick.afterStomps, tick.gored),
        tick.fallingSpikes,
        tick.state.level,
      ),
    );
  });

  it('should start the death of a gored enemy before the bullets fly when the player is gored', () => {
    const tick = createTickHarm();
    const harm: TickHarm = {
      ...tick,
      flyingBullets: [],
      gored: take(tick.afterStomps, 1),
    };

    const volley = computeTickVolley(harm);

    expect(head(volley.shot)?.timers.death).toBe(0);
    expect(nth(volley.shot, 1)).toBe(nth(tick.afterStomps, 1));
  });

  it('should leave the enemies, the falling spikes and the level alone when no bullet flies', () => {
    const tick = createTickHarm();
    const harm: TickHarm = { ...tick, flyingBullets: [], gored: [] };

    const volley = computeTickVolley(harm);

    expect(volley.bullets).toEqual([]);
    expect(volley.shot).toEqual(tick.afterStomps);
    expect(volley.unshot).toBe(tick.fallingSpikes);
    expect(volley.level).toBe(tick.state.level);
  });

  it('should pass the same game on when the bullets fly', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect(volley.state).toBe(tick.state);
  });

  it('should pass the same elapsed time on when the bullets fly', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect(volley.deltaSeconds).toBe(tick.deltaSeconds);
  });

  it('should pass the same cannons on when the bullets fly', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect(volley.cannons).toBe(tick.cannons);
  });

  it('should pass the same flying cannonballs on when the bullets fly', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect(volley.flying).toBe(tick.flying);
  });

  it('should pass the same fireballs on when the bullets fly', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect(volley.fireballs).toBe(tick.fireballs);
  });

  it('should pass the same cannonball hits on when the bullets fly', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect(volley.hits).toBe(tick.hits);
  });

  it('should pass the same player on when the bullets fly', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect(volley.player).toBe(tick.player);
  });

  it('should pass the same deaths on when the bullets fly', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect(volley.deaths).toBe(tick.deaths);
  });

  it('should pass the same game status on when the bullets fly', () => {
    const tick = createTickHarm();

    const volley = computeTickVolley(tick);

    expect(volley.status).toBe(tick.status);
  });
});
