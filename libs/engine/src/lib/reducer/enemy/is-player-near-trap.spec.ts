import {
  type Enemy,
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { map, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import {
  BEARTRAP_TRIGGER_RANGE,
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  HORNED_ENEMY_CHANCE,
} from './consts';
import { createEnemies } from './create-enemies';
import { isPlayerNearTrap } from './is-player-near-trap';

const WIDTH = 20;

const HEIGHT = 14;

const FLOOR_ROW = 12;

const TRAP_ROW = FLOOR_ROW - 1;

const TRAP_COLUMN = 6;

const TRAP_X = TRAP_COLUMN * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;

const TRAP_Y = FLOOR_ROW * TILE_SIZE - ENEMY_HEIGHT;

const TRAP_CENTRE_X = TRAP_X + ENEMY_WIDTH / 2;

const TRAP_CENTRE_Y = TRAP_Y + ENEMY_HEIGHT / 2;

const createRoom = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row): Tile[] =>
    times(WIDTH, (column) =>
      match({
        isFloor: row >= FLOOR_ROW,
        isTrap: row === TRAP_ROW && column === TRAP_COLUMN,
      })
        .with({ isFloor: true }, (): Tile => TILE_DIRT)
        .with({ isTrap: true }, (): Tile => TILE_BEARTRAP)
        .otherwise((): Tile => TILE_AIR),
    ),
  ),
  chestItems: [],
});

const createTrap = (level: Level): Enemy =>
  createEnemies({
    ...level,
    hornedEnemyChance: HORNED_ENEMY_CHANCE,
    fastEnemyChance: 0,
    shooterEnemyChance: 0,
    freezingEnemyChance: 0,
  })[0];

const createStandingPlayer = (gap: number): Player => ({
  position: {
    x: TRAP_CENTRE_X + gap - PLAYER_WIDTH / 2,
    y: FLOOR_ROW * TILE_SIZE - PLAYER_HEIGHT,
  },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const createPlayerEyeToEye = (gap: number): Player =>
  pipe(gap, createStandingPlayer, (watcher): Player => ({
    ...watcher,
    position: {
      ...watcher.position,
      y: TRAP_CENTRE_Y - PLAYER_HEIGHT / 2,
    },
  }));

describe('isPlayerNearTrap', () => {
  it('should notice the player when they stand two blocks off or closer on either side', () => {
    const gaps = [-BEARTRAP_TRIGGER_RANGE, -1, 1, BEARTRAP_TRIGGER_RANGE];
    const sightings = map(gaps, (gap) =>
      isPlayerNearTrap(createTrap(createRoom()), createPlayerEyeToEye(gap)),
    );

    times(size(gaps), (gapIndex) =>
      expect(sightings[gapIndex], 'gap ' + gaps[gapIndex]).toBe(true),
    );
  });

  it('should miss the player when they stand a pixel beyond two blocks on either side', () => {
    const gaps = map([-1, 1], (sign) => sign * (BEARTRAP_TRIGGER_RANGE + 1));
    const sightings = map(gaps, (gap) =>
      isPlayerNearTrap(createTrap(createRoom()), createPlayerEyeToEye(gap)),
    );

    times(size(gaps), (gapIndex) =>
      expect(sightings[gapIndex], 'gap ' + gaps[gapIndex]).toBe(false),
    );
  });

  it('should notice the player when they sail overhead within two blocks', () => {
    const leaping = createPlayerEyeToEye(TILE_SIZE);
    leaping.position.y -= TILE_SIZE * 3;

    expect(isPlayerNearTrap(createTrap(createRoom()), leaping)).toBe(true);
  });

  it('should ignore the player when they are already dead', () => {
    const fallen = createPlayerEyeToEye(0);
    fallen.timers.death = 0;

    expect(isPlayerNearTrap(createTrap(createRoom()), fallen)).toBe(false);
  });
});
