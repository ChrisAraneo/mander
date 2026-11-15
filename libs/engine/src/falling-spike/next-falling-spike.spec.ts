import {
  type FallingSpike,
  GRAVITY,
  type Level,
  PRONG_HEIGHT,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { ceil, head, map, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import {
  FALLING_SPIKE_TRIGGER_DEPTH_TILES,
  FALLING_SPIKE_TRIGGER_TILES,
} from './consts';
import { createFallingSpikes } from './create-falling-spikes';
import { nextFallingSpike } from './next-falling-spike';
import { nextFallingSpikes } from './next-falling-spikes';

const DELTA_SECONDS = 1 / 60;

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  v: TILE_SPIKE_FALLING,
};

const ROWS = [
  '############',
  '.....v......',
  '............',
  '............',
  '............',
  '............',
  '............',
  '............',
  '############',
  '............',
];

const CEILING_ROW = 1;

const FLOOR_ROW = 8;

const SPIKE_COLUMN = 5;

const PLAYER_ROWS_ABOVE_FLOOR = 2;

const NO_GAP = 0;

const LEFT_COLUMN = 0;

const LONG_FRAME_SECONDS = 1 / 15;

const FLOORLESS_FRAME_LIMIT = 300;

const LONG_FRAME_LIMIT = 60;

const WIDTH = size(head(ROWS));

const createLevel = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const patchFloorlessTiles = (level: Level): Level => ({
  ...level,
  tiles: map(level.tiles, (tiles, rowIndex) =>
    match(rowIndex === FLOOR_ROW)
      .with(true, () => times(WIDTH, (): Tile => TILE_AIR))
      .otherwise(() => tiles),
  ),
});

const createFloorlessLevel = (): Level => patchFloorlessTiles(createLevel());

const SHIELD_ROW = 4;

const patchShieldedTiles = (level: Level): Level => ({
  ...level,
  tiles: map(level.tiles, (tiles, rowIndex) =>
    map(tiles, (tile, columnIndex) =>
      match(rowIndex === SHIELD_ROW && columnIndex === SPIKE_COLUMN)
        .with(true, (): Tile => TILE_DIRT)
        .otherwise(() => tile),
    ),
  ),
});

const createShieldedLevel = (): Level => patchShieldedTiles(createLevel());

const createPlayer = (column: number): Player => ({
  position: {
    x: column * TILE_SIZE,
    y: (FLOOR_ROW - PLAYER_ROWS_ABOVE_FLOOR) * TILE_SIZE,
  },
  velocity: createBasePlayerVelocity(),
  hearts: { value: BASE_HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const createFallingSpike = (level: Level): FallingSpike =>
  createFallingSpikes(level)[0];

const SPIKE_CENTRE = SPIKE_COLUMN * TILE_SIZE + TILE_SIZE / 2;

const TRIGGER_RANGE = FALLING_SPIKE_TRIGGER_TILES * TILE_SIZE;

const createPlayerAt = (gap: number): Player =>
  pipe(LEFT_COLUMN, createPlayer, (walking): Player => ({
    ...walking,
    position: {
      ...walking.position,
      x: SPIKE_CENTRE + gap - PLAYER_WIDTH / 2,
    },
  }));

const SPIKE_CENTRE_Y = CEILING_ROW * TILE_SIZE + TILE_SIZE / 2;

const TRIGGER_DEPTH = FALLING_SPIKE_TRIGGER_DEPTH_TILES * TILE_SIZE;

const createPlayerBelow = (depth: number): Player =>
  pipe(NO_GAP, createPlayerAt, (hanging): Player => ({
    ...hanging,
    position: {
      ...hanging.position,
      y: SPIKE_CENTRE_Y + depth - PLAYER_HEIGHT / 2,
    },
  }));

const nextFramesWhileSpikesRemain = (
  level: Level,
  spikes: FallingSpike[],
  player: Player,
  frameLimit: number,
): FallingSpike[] =>
  match(frameLimit > 0 && size(spikes) > 0)
    .with(true, () =>
      nextFramesWhileSpikesRemain(
        level,
        nextFallingSpikes(level, spikes, player, DELTA_SECONDS),
        player,
        frameLimit - 1,
      ),
    )
    .otherwise(() => spikes);

const computeFall = (seconds: number, player: Player): FallingSpike[] =>
  pipe(
    createLevel(),
    (level) => ({ level, spikes: createFallingSpikes(level) }),
    ({ level, spikes }) =>
      nextFramesWhileSpikesRemain(
        level,
        spikes,
        player,
        ceil(seconds / DELTA_SECONDS),
      ),
  );

interface SpikeFall {
  spikes: FallingSpike[];
  lowest: number;
}

const nextLongFrames = (
  level: Level,
  fall: SpikeFall,
  frameLimit: number,
): SpikeFall =>
  match(frameLimit > 0 && size(fall.spikes) > 0)
    .with(true, () =>
      pipe(
        nextFallingSpikes(
          level,
          fall.spikes,
          createPlayerAt(NO_GAP),
          LONG_FRAME_SECONDS,
        ),
        (spikes): SpikeFall => ({
          spikes,
          lowest: match(size(spikes) > 0)
            .with(true, () => spikes[0].position.y)
            .otherwise(() => fall.lowest),
        }),
        (next) => nextLongFrames(level, next, frameLimit - 1),
      ),
    )
    .otherwise(() => fall);

describe('nextFallingSpike', () => {
  it('should hold on when the player is further off than two blocks', () => {
    const level = createLevel();
    const gaps = map([-1, 1], (sign) => sign * (TRIGGER_RANGE + 1));
    const heldSpikes = map(gaps, (gap) =>
      nextFallingSpike(
        level,
        createFallingSpike(level),
        createPlayerAt(gap),
        DELTA_SECONDS,
      ),
    );

    times(size(gaps), (gapIndex) =>
      expect(heldSpikes[gapIndex], `gap ${gaps[gapIndex]}`).toEqual(
        createFallingSpike(level),
      ),
    );
  });

  it('should let go when the player comes within two blocks on either side', () => {
    const level = createLevel();
    const gaps = [-TRIGGER_RANGE, -1, 1, TRIGGER_RANGE];
    const droppedSpikes = map(gaps, (gap) =>
      nextFallingSpike(
        level,
        createFallingSpike(level),
        createPlayerAt(gap),
        DELTA_SECONDS,
      ),
    );

    times(size(gaps), (gapIndex) =>
      expect(
        droppedSpikes[gapIndex]?.statuses.isFalling,
        `gap ${gaps[gapIndex]}`,
      ).toBe(true),
    );
    times(size(gaps), (gapIndex) =>
      expect(
        droppedSpikes[gapIndex]?.position.y,
        `gap ${gaps[gapIndex]}`,
      ).toBeGreaterThan(createFallingSpike(level).position.y),
    );
  });

  it('should hold on when the player is further below than seven blocks', () => {
    const level = createLevel();
    const held = nextFallingSpike(
      level,
      createFallingSpike(level),
      createPlayerBelow(TRIGGER_DEPTH + 1),
      DELTA_SECONDS,
    );

    expect(held).toEqual(createFallingSpike(level));
  });

  it('should let go when the player is below it within seven blocks', () => {
    const level = createLevel();
    const depths = [1, TRIGGER_DEPTH];
    const droppedSpikes = map(depths, (depth) =>
      nextFallingSpike(
        level,
        createFallingSpike(level),
        createPlayerBelow(depth),
        DELTA_SECONDS,
      ),
    );

    times(size(depths), (depthIndex) =>
      expect(
        droppedSpikes[depthIndex]?.statuses.isFalling,
        `depth ${depths[depthIndex]}`,
      ).toBe(true),
    );
  });

  it('should hold on when the player is above it or level with it', () => {
    const level = createLevel();
    const depths = [-TRIGGER_DEPTH, -1, 0];
    const heldSpikes = map(depths, (depth) =>
      nextFallingSpike(
        level,
        createFallingSpike(level),
        createPlayerBelow(depth),
        DELTA_SECONDS,
      ),
    );

    times(size(depths), (depthIndex) =>
      expect(heldSpikes[depthIndex], `depth ${depths[depthIndex]}`).toEqual(
        createFallingSpike(level),
      ),
    );
  });

  it('should hold on when a solid block lies between it and the player below', () => {
    const level = createShieldedLevel();
    const gaps = [-TRIGGER_RANGE, 0, TRIGGER_RANGE];
    const heldSpikes = map(gaps, (gap) =>
      nextFallingSpike(
        level,
        createFallingSpike(level),
        createPlayerAt(gap),
        DELTA_SECONDS,
      ),
    );

    times(size(gaps), (gapIndex) =>
      expect(heldSpikes[gapIndex], `gap ${gaps[gapIndex]}`).toEqual(
        createFallingSpike(level),
      ),
    );
  });

  it('should fall at the speed of gravity when it lets go', () => {
    const level = createLevel();
    const dropped = nextFallingSpike(
      level,
      createFallingSpike(level),
      createPlayerAt(NO_GAP),
      DELTA_SECONDS,
    );

    expect(dropped?.velocity.y.current).toBeCloseTo(GRAVITY * DELTA_SECONDS, 6);
    expect(dropped?.position.y).toBeCloseTo(
      createFallingSpike(level).position.y +
        GRAVITY * DELTA_SECONDS * DELTA_SECONDS,
      6,
    );
  });

  it('should keep falling when the player has walked back out of reach', () => {
    const level = createLevel();
    const dropped = nextFallingSpike(
      level,
      createFallingSpike(level),
      createPlayerAt(NO_GAP),
      DELTA_SECONDS,
    );
    const further = nextFallingSpike(
      level,
      dropped ?? createFallingSpike(level),
      createPlayerAt(TRIGGER_RANGE * 4),
      DELTA_SECONDS,
    );

    expect(further?.position.y).toBeGreaterThan(dropped?.position.y ?? NaN);
  });

  it('should be destroyed when it lands on a solid', () => {
    expect(computeFall(3, createPlayerAt(NO_GAP))).toEqual([]);
  });

  it('should never reach the floor when it was never released', () => {
    expect(size(computeFall(3, createPlayerAt(TRIGGER_RANGE * 3)))).toBe(1);
  });

  it('should be destroyed rather than left falling when the level has no floor', () => {
    const level = createFloorlessLevel();
    const spikes = nextFramesWhileSpikesRemain(
      level,
      createFallingSpikes(level),
      createPlayerAt(NO_GAP),
      FLOORLESS_FRAME_LIMIT,
    );

    expect(spikes).toEqual([]);
  });

  it('should land tip-first on the block it strikes when the frames run long', () => {
    const level = createLevel();
    const start = createFallingSpikes(level);
    const { spikes, lowest } = nextLongFrames(
      level,
      { spikes: start, lowest: start[0].position.y },
      LONG_FRAME_LIMIT,
    );

    expect(spikes).toEqual([]);
    expect(lowest + PRONG_HEIGHT).toBeLessThanOrEqual(FLOOR_ROW * TILE_SIZE);
  });

  it('should leave the given level, spike and player unchanged when it moves the spike on', () => {
    const level = createLevel();
    const spike = createFallingSpike(level);
    const player = createPlayerAt(NO_GAP);

    nextFallingSpike(level, spike, player, DELTA_SECONDS);

    expect(level).toEqual(createLevel());
    expect(spike).toEqual(createFallingSpike(createLevel()));
    expect(player).toEqual(createPlayerAt(NO_GAP));
  });
});
