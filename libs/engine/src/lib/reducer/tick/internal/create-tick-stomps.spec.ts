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
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { createTickStomps } from './create-tick-stomps';
import type { TickBounce } from './types/tick-bounce';
import type { TickHazards } from './types/tick-hazards';

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

const LEVEL = createLevel(['..c.....', '...v..f.', 's...e...', '########']);

const BASE_STATE = createInitialState(LEVEL, 0, []);

const HAZARDS: TickHazards = computeTickHazards(
  computeTickPlayer({
    state: {
      ...BASE_STATE,
      input: { isLeft: false, isRight: true, isJump: false },
    },
    deltaSeconds: 0.02,
  }),
);

const BOUNCE: TickBounce = {
  player: { ...HAZARDS.moved },
  enemies: [...HAZARDS.steppedEnemies],
};

describe('createTickStomps', () => {
  it('should give the bounced player as the bounced one when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.bounced).toBe(BOUNCE.player);
  });

  it('should give the bounced enemies as the ones after the stomps when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.afterStomps).toBe(BOUNCE.enemies);
  });

  it('should give no enemies after the stomps when the bounce has no enemies', () => {
    const stomps = createTickStomps(HAZARDS, { ...BOUNCE, enemies: [] });

    expect(stomps.afterStomps).toEqual([]);
  });

  it('should pass the same game on when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.state).toBe(HAZARDS.state);
  });

  it('should pass the same elapsed time on when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.deltaSeconds).toBe(HAZARDS.deltaSeconds);
  });

  it('should pass on whether the player is alive when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.isPlayerAlive).toBe(HAZARDS.isPlayerAlive);
  });

  it('should pass the same cannons on when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.cannons).toBe(HAZARDS.cannons);
  });

  it('should pass the same flying cannonballs on when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.flying).toBe(HAZARDS.flying);
  });

  it('should pass the same falling spikes on when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.fallingSpikes).toBe(HAZARDS.fallingSpikes);
  });

  it('should pass the same fireballs on when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.fireballs).toBe(HAZARDS.fireballs);
  });

  it('should pass the same flying bullets on when the stomps are made', () => {
    const stomps = createTickStomps(HAZARDS, BOUNCE);

    expect(stomps.flyingBullets).toBe(HAZARDS.flyingBullets);
  });
});
