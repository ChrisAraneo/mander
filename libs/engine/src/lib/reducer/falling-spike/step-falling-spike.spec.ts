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
import { chain } from '@mander/utils';
import { ceil, map, size, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { advanceFallingSpikes } from './advance-falling-spikes';
import {
  FALLING_SPIKE_TRIGGER_DEPTH_TILES,
  FALLING_SPIKE_TRIGGER_TILES,
} from './consts';
import { createFallingSpikes } from './create-falling-spikes';
import { stepFallingSpike } from './step-falling-spike';

const DELTA_SECONDS = 1 / 60;

const CEILING_ROW = 1;

const FLOOR_ROW = 8;

const SPIKE_COLUMN = 5;

const WIDTH = 12;

const HEIGHT = 10;

const createRoom = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row): Tile[] =>
    times(WIDTH, (column) =>
      match({
        isDirt: row === 0 || row === FLOOR_ROW,
        isSpike: row === CEILING_ROW && column === SPIKE_COLUMN,
      })
        .with({ isDirt: true }, (): Tile => TILE_DIRT)
        .with({ isSpike: true }, (): Tile => TILE_SPIKE_FALLING)
        .otherwise((): Tile => TILE_AIR),
    ),
  ),
  chestItems: [],
});

const createFloorlessRoom = (): Level =>
  chain(createRoom())
    .thru((level): Level => ({
      ...level,
      tiles: map(level.tiles, (tiles, rowIndex) =>
        match(rowIndex === FLOOR_ROW)
          .with(true, () => times(WIDTH, (): Tile => TILE_AIR))
          .otherwise(() => tiles),
      ),
    }))
    .value();

const createPlayer = (tileX: number): Player => ({
  position: {
    x: tileX * TILE_SIZE,
    y: (FLOOR_ROW - 2) * TILE_SIZE,
  },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const createFallingSpike = (level: Level): FallingSpike =>
  createFallingSpikes(level)[0];

const SPIKE_CENTRE = SPIKE_COLUMN * TILE_SIZE + TILE_SIZE / 2;

const TRIGGER_RANGE = FALLING_SPIKE_TRIGGER_TILES * TILE_SIZE;

const createPlayerAt = (gap: number): Player =>
  chain(createPlayer(0))
    .thru((walking): Player => ({
      ...walking,
      position: {
        ...walking.position,
        x: SPIKE_CENTRE + gap - PLAYER_WIDTH / 2,
      },
    }))
    .value();

const SPIKE_MIDDLE = CEILING_ROW * TILE_SIZE + TILE_SIZE / 2;

const TRIGGER_DEPTH = FALLING_SPIKE_TRIGGER_DEPTH_TILES * TILE_SIZE;

const createPlayerBelow = (depth: number): Player =>
  chain(createPlayerAt(0))
    .thru((hanging): Player => ({
      ...hanging,
      position: {
        ...hanging.position,
        y: SPIKE_MIDDLE + depth - PLAYER_HEIGHT / 2,
      },
    }))
    .value();

const nextFramesWhileSpikesRemain = (
  level: Level,
  spikes: FallingSpike[],
  watcher: Player,
  frameLimit: number,
): FallingSpike[] =>
  match(frameLimit > 0 && size(spikes) > 0)
    .with(true, () =>
      nextFramesWhileSpikesRemain(
        level,
        advanceFallingSpikes(level, spikes, watcher, DELTA_SECONDS),
        watcher,
        frameLimit - 1,
      ),
    )
    .otherwise(() => spikes);

const computeFall = (seconds: number, watcher: Player): FallingSpike[] =>
  chain(createRoom())
    .thru((level) =>
      nextFramesWhileSpikesRemain(
        level,
        createFallingSpikes(level),
        watcher,
        ceil(seconds / DELTA_SECONDS),
      ),
    )
    .value();

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
      chain(advanceFallingSpikes(level, fall.spikes, createPlayerAt(0), 1 / 15))
        .thru((spikes) =>
          nextLongFrames(
            level,
            {
              spikes,
              lowest: match(size(spikes) > 0)
                .with(true, () => spikes[0].position.y)
                .otherwise(() => fall.lowest),
            },
            frameLimit - 1,
          ),
        )
        .value(),
    )
    .otherwise(() => fall);

describe('stepFallingSpike', () => {
  it('should hold on when the player is further off than two blocks', () => {
    const level = createRoom();
    const gaps = map([-1, 1], (sign) => sign * (TRIGGER_RANGE + 1));
    const heldSpikes = map(gaps, (gap) =>
      stepFallingSpike(
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
    const level = createRoom();
    const gaps = [-TRIGGER_RANGE, -1, 1, TRIGGER_RANGE];
    const droppedSpikes = map(gaps, (gap) =>
      stepFallingSpike(
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
      expect(droppedSpikes[gapIndex]?.position.y).toBeGreaterThan(
        createFallingSpike(level).position.y,
      ),
    );
  });

  it('should hold on when the player is further below than seven blocks', () => {
    const level = createRoom();
    const held = stepFallingSpike(
      level,
      createFallingSpike(level),
      createPlayerBelow(TRIGGER_DEPTH + 1),
      DELTA_SECONDS,
    );

    expect(held).toEqual(createFallingSpike(level));
  });

  it('should let go when the player is below it within seven blocks', () => {
    const level = createRoom();
    const depths = [1, TRIGGER_DEPTH];
    const droppedSpikes = map(depths, (depth) =>
      stepFallingSpike(
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
    const level = createRoom();
    const depths = [-TRIGGER_DEPTH, -1, 0];
    const heldSpikes = map(depths, (depth) =>
      stepFallingSpike(
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

  it('should fall at the speed of gravity when it lets go', () => {
    const level = createRoom();
    const dropped = stepFallingSpike(
      level,
      createFallingSpike(level),
      createPlayerAt(0),
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
    const level = createRoom();
    const dropped = stepFallingSpike(
      level,
      createFallingSpike(level),
      createPlayerAt(0),
      DELTA_SECONDS,
    );
    const further = stepFallingSpike(
      level,
      dropped ?? createFallingSpike(level),
      createPlayerAt(TRIGGER_RANGE * 4),
      DELTA_SECONDS,
    );

    expect(further?.position.y).toBeGreaterThan(dropped?.position.y ?? NaN);
  });

  it('should be destroyed when it lands on a solid', () => {
    expect(computeFall(3, createPlayerAt(0))).toEqual([]);
  });

  it('should never reach the floor when it was never released', () => {
    expect(size(computeFall(3, createPlayerAt(TRIGGER_RANGE * 3)))).toBe(1);
  });

  it('should be destroyed rather than left falling when the level has no floor', () => {
    const level = createFloorlessRoom();
    const spikes = nextFramesWhileSpikesRemain(
      level,
      createFallingSpikes(level),
      createPlayerAt(0),
      300,
    );

    expect(spikes).toEqual([]);
  });

  it('should land tip-first on the block it strikes when the frames run long', () => {
    const level = createRoom();
    const start = createFallingSpikes(level);
    const { spikes, lowest } = nextLongFrames(
      level,
      { spikes: start, lowest: start[0].position.y },
      60,
    );

    expect(spikes).toEqual([]);
    expect(lowest + PRONG_HEIGHT).toBeLessThanOrEqual(FLOOR_ROW * TILE_SIZE);
  });
});
