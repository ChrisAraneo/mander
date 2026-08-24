import {
  GRAVITY,
  type Item,
  type Level,
  PRONG_HEIGHT,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
  TITANIUM_HELMET,
} from '@mander/model';
import { size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { createInitialState } from '../../state/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import { HORNED_ENEMY_CHANCE } from '../enemy/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { reduce } from '../reduce';
import { advanceFallingSpikes } from './advance-falling-spikes';
import { FALLING_SPIKE_TRIGGER_TILES } from './consts';
import { createFallingSpikes } from './create-falling-spikes';
import { isTouchingFallingSpike } from './is-touching-falling-spike';
import { stepFallingSpike } from './step-falling-spike';

const DELTA_SECONDS = 1 / 60;

const CEILING_ROW = 1;
const FLOOR_ROW = 8;
const SPIKE_COLUMN = 5;
const WIDTH = 12;
const HEIGHT = 10;

const room = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row): Tile[] =>
    times(WIDTH, (column): Tile => {
      if (row === 0 || row === FLOOR_ROW) return TILE_DIRT;
      if (row === CEILING_ROW && column === SPIKE_COLUMN)
        return TILE_SPIKE_FALLING;
      return TILE_AIR;
    }),
  ),
  chestItems: [],
});

const player = (tileX: number): Player => ({
  position: {
    x: tileX * TILE_SIZE,
    y: (FLOOR_ROW - 2) * TILE_SIZE,
  },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const spikeIn = (level: Level) => createFallingSpikes(level)[0];

const SPIKE_CENTRE = SPIKE_COLUMN * TILE_SIZE + TILE_SIZE / 2;

const TRIGGER_RANGE = FALLING_SPIKE_TRIGGER_TILES * TILE_SIZE;

const playerAt = (gap: number): Player => {
  const walking = player(0);
  walking.position.x = SPIKE_CENTRE + gap - PLAYER_WIDTH / 2;
  return walking;
};

const fallFor = (seconds: number, watcher: Player) => {
  const level = room();
  let spikes = createFallingSpikes(level);
  const frames = Math.ceil(seconds / DELTA_SECONDS);
  for (let frame = 0; frame < frames && size(spikes) > 0; frame++)
    spikes = advanceFallingSpikes(level, spikes, watcher, DELTA_SECONDS);
  return spikes;
};

describe('createFallingSpikes', () => {
  it('hangs one spike, unmoving, on every tile that asks for it', () => {
    expect(createFallingSpikes(room())).toEqual([
      {
        position: {
          x: SPIKE_COLUMN * TILE_SIZE,
          y: CEILING_ROW * TILE_SIZE,
        },
        velocity: { y: { current: 0, max: expect.any(Number) } },
        statuses: { isFalling: false },
      },
    ]);
  });

  it('finds nothing to hang in a room without the tile', () => {
    const bare = room();
    bare.tiles[CEILING_ROW][SPIKE_COLUMN] = TILE_AIR;

    expect(createFallingSpikes(bare)).toEqual([]);
  });
});

describe('stepFallingSpike', () => {
  it('holds on while the player is further off than two blocks', () => {
    const level = room();

    times(2, (side) => {
      const gap = (side === 0 ? -1 : 1) * (TRIGGER_RANGE + 1);
      const held = stepFallingSpike(
        level,
        spikeIn(level),
        playerAt(gap),
        DELTA_SECONDS,
      );

      expect(held, `gap ${gap}`).toEqual(spikeIn(level));
    });
  });

  it('lets go at two blocks, and at anything closer, from either side', () => {
    const level = room();

    times(4, (index) => {
      const gap = [-TRIGGER_RANGE, -1, 1, TRIGGER_RANGE][index];
      const dropped = stepFallingSpike(
        level,
        spikeIn(level),
        playerAt(gap),
        DELTA_SECONDS,
      );

      expect(dropped?.statuses.isFalling, `gap ${gap}`).toBe(true);
      expect(dropped?.position.y).toBeGreaterThan(spikeIn(level).position.y);
    });
  });

  it('falls at the speed of gravity', () => {
    const level = room();
    const dropped = stepFallingSpike(
      level,
      spikeIn(level),
      playerAt(0),
      DELTA_SECONDS,
    );

    expect(dropped?.velocity.y.current).toBeCloseTo(GRAVITY * DELTA_SECONDS, 6);
    expect(dropped?.position.y).toBeCloseTo(
      spikeIn(level).position.y + GRAVITY * DELTA_SECONDS * DELTA_SECONDS,
      6,
    );
  });

  it('keeps falling after the player has walked back out of reach', () => {
    const level = room();
    const dropped = stepFallingSpike(
      level,
      spikeIn(level),
      playerAt(0),
      DELTA_SECONDS,
    );
    const further = stepFallingSpike(
      level,
      dropped!,
      playerAt(TRIGGER_RANGE * 4),
      DELTA_SECONDS,
    );

    expect(further?.position.y).toBeGreaterThan(dropped!.position.y);
  });

  it('is destroyed by the solid it lands on', () => {
    expect(fallFor(3, playerAt(0))).toEqual([]);
  });

  it('never reaches the floor it was never released over', () => {
    expect(size(fallFor(3, playerAt(TRIGGER_RANGE * 3)))).toBe(1);
  });

  it('is destroyed rather than left falling below a level without a floor', () => {
    const level = room();
    for (let column = 0; column < WIDTH; column++)
      level.tiles[FLOOR_ROW][column] = TILE_AIR;

    let spikes = createFallingSpikes(level);
    for (let frame = 0; frame < 300 && size(spikes) > 0; frame++)
      spikes = advanceFallingSpikes(level, spikes, playerAt(0), DELTA_SECONDS);

    expect(spikes).toEqual([]);
  });

  it('lands tip-first on the block it strikes, whatever the frame length', () => {
    const level = room();
    let spikes = createFallingSpikes(level);
    let lowest = spikes[0].position.y;

    for (let frame = 0; frame < 60 && size(spikes) > 0; frame++) {
      spikes = advanceFallingSpikes(level, spikes, playerAt(0), 1 / 15);
      if (size(spikes) > 0) lowest = spikes[0].position.y;
    }

    expect(spikes).toEqual([]);
    expect(lowest + PRONG_HEIGHT).toBeLessThanOrEqual(FLOOR_ROW * TILE_SIZE);
  });
});

describe('isTouchingFallingSpike', () => {
  const under = (spikeY: number): Player => {
    const standing = playerAt(0);
    standing.position.y = spikeY + PRONG_HEIGHT - PLAYER_HEIGHT / 2;
    return standing;
  };

  it('bites the player the prong has reached', () => {
    const level = room();
    const spike = spikeIn(level);

    expect(isTouchingFallingSpike(under(spike.position.y), spike)).toBe(true);
  });

  it('leaves alone a player standing clear of the prong', () => {
    const level = room();
    const spike = spikeIn(level);
    const aside = under(spike.position.y);
    aside.position.x = spike.position.x + TILE_SIZE + PLAYER_WIDTH;

    expect(isTouchingFallingSpike(aside, spike)).toBe(false);
  });
});

describe('a level being played', () => {
  const arena = (): GameLevel => {
    const level = room();
    level.tiles[FLOOR_ROW - 1][SPIKE_COLUMN] = TILE_SPAWN;
    return { ...level, hornedEnemyChance: HORNED_ENEMY_CHANCE };
  };

  const played = (inventory: Item[], frames: number): GameState => {
    let state = createInitialState(arena(), 0, inventory);
    for (let frame = 0; frame < frames; frame++)
      state = reduce(state, { type: 'TICK', deltaSeconds: DELTA_SECONDS });
    return state;
  };

  it('costs a heart to the player it lands on, and shatters on the floor', () => {
    const struck = played([], 60);

    expect(struck.player.hearts.value).toBe(BASE_HEARTS - 1);
    expect(struck.fallingSpikes).toEqual([]);
  });

  it('glances off the helmet that turns the ceiling spikes it left', () => {
    expect(played([TITANIUM_HELMET], 60).player.hearts.value).toBe(BASE_HEARTS);
  });

  it('hangs again when the player respawns, as the enemies do', () => {
    const struck = played([], 60);
    const respawned = reduce(struck, { type: 'RESPAWN' });

    expect(respawned.fallingSpikes).toEqual(createFallingSpikes(arena()));
    expect(respawned.enemies).toEqual([]);
  });
});
