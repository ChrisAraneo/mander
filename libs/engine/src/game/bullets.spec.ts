import {
  type Enemy,
  type EnemyKind,
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import {
  ceil,
  constant,
  head,
  map,
  reduce,
  size,
  some,
  times,
} from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { BASE_AMMO } from '../bullet/consts';
import { ENEMY_HEIGHT, HORNED_ENEMY_CHANCE } from '../enemy/consts';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { BASE_HEARTS, PLAYER_HEIGHT } from '../player/consts';
import { isOverlappingSpike } from '../spike/is-overlapping-spike';
import { createInitialState } from '../start/create-initial-state';
import { removeUpdateTime } from '../state/remove-update-time';
import type { Action } from '../state/types/action';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { nextGameState } from './next-game-state';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  K: TILE_KEY,
  C: TILE_CHEST,
  P: TILE_PORTAL,
};

const ROWS = [
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#.S......................P...#',
  '#.S............K....C....P...#',
  '##########..##################',
  '##########..##################',
  '##########..##################',
];

const SURFACE_ROW = 12;
const SPIKE_ROW = 11;
const SPIKE_COLUMN = 3;
const SHOOTER_COLUMN = 5;
const ENEMY_SPAWN_COLUMN = 7;
const SPIKE_PROBE_SIZE = 1;
const TICKS_PER_TURN = 3;

const SURFACE = SURFACE_ROW * TILE_SIZE;

const DELTA_SECONDS = 1 / 60;

interface SpawnCell {
  column: number;
  row: number;
}

const ENEMY_SPAWN: SpawnCell = {
  column: ENEMY_SPAWN_COLUMN,
  row: SPIKE_ROW,
};

const SHOOTER_LEFT = SHOOTER_COLUMN * TILE_SIZE;

const createItem = (id: string, effect?: Item['effect']): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: effect ?? { kind: 'NONE' },
});

const CARDS: Item[] = [
  createItem('CARD-0'),
  createItem('CARD-1'),
  createItem('CARD-2'),
  createItem('CARD-3'),
  createItem('CARD-4'),
];

const createTestLevel = (enemies: SpawnCell[] = []): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row, rowIndex) =>
    map(row, (symbol, columnIndex) =>
      match(
        some(
          enemies,
          (spawn) => spawn.column === columnIndex && spawn.row === rowIndex,
        ),
      )
        .with(true, () => TILE_ENEMY)
        .otherwise(() => LEGEND[symbol]),
    ),
  ),
  chestItems: CARDS,
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const patchSpikeTile = (level: GameLevel, column: number): GameLevel => ({
  ...level,
  tiles: map(level.tiles, (row, rowIndex) =>
    map(row, (tile, columnIndex) =>
      match(rowIndex === SPIKE_ROW && columnIndex === column)
        .with(true, () => TILE_SPIKE)
        .otherwise(() => tile),
    ),
  ),
});

const createSpikeLevel = (column: number): GameLevel =>
  patchSpikeTile(createTestLevel(), column);

const patchCeilingSpikeTiles = (
  level: GameLevel,
  column: number,
  row: number,
): GameLevel => ({
  ...level,
  tiles: map(level.tiles, (tiles, rowIndex) =>
    map(tiles, (tile, columnIndex) =>
      match({ isSpikeColumn: columnIndex === column, rowIndex })
        .with({ isSpikeColumn: true, rowIndex: row - 1 }, () => TILE_DIRT)
        .with({ isSpikeColumn: true, rowIndex: row }, () => TILE_SPIKE_CEILING)
        .otherwise(() => tile),
    ),
  ),
});

const createCeilingSpikeLevel = (column: number, row: number): GameLevel =>
  patchCeilingSpikeTiles(createTestLevel(), column, row);

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const nextTicks = (state: GameState, tickCount: number): GameState =>
  reduce(times(tickCount), (current) => nextTick(current), state);

const computeTickCount = (seconds: number): number =>
  ceil(seconds / DELTA_SECONDS) + 1;

const createAmmoBelt = (amount: number): Item =>
  createItem('AMMO-BELT', { kind: 'BULLET', amount });

const createArmedState = (
  level: GameLevel,
  left: number,
  amount: number,
  kind?: EnemyKind,
): GameState =>
  pipe(
    createInitialState(level, FIRST_LEVEL_INDEX, [createAmmoBelt(amount)]),
    (state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: { x: left, y: SURFACE - PLAYER_HEIGHT },
      },
      enemies: map(state.enemies, (enemy): Enemy => ({
        ...enemy,
        kind: kind ?? enemy.kind,
        position: { ...enemy.position, y: SURFACE - ENEMY_HEIGHT },
      })),
    }),
    nextTick,
  );

const createShooterState = (amount: number): GameState =>
  createArmedState(createTestLevel(), SHOOTER_LEFT, amount);

const nextShot = (state: GameState): GameState =>
  nextGameState(state, { type: 'SHOOT' }, constant(0));

const nextMoveStart = (state: GameState, action: Action): GameState =>
  nextTicks(nextGameState(state, action, constant(0)), TICKS_PER_TURN);

const nextTurnRight = (state: GameState): GameState =>
  nextMoveStart(state, { type: 'MOVE_RIGHT_START' });

const nextTurnLeft = (state: GameState): GameState =>
  nextMoveStart(state, { type: 'MOVE_LEFT_START' });

describe('bullets', () => {
  it('should load a round for every bullet when the pack holds them', () => {
    expect(createShooterState(3).ammo).toBe(BASE_AMMO + 3);
  });

  it('should spend a round and put a bullet in the air when the player shoots', () => {
    const state = nextShot(createShooterState(2));

    expect(state.ammo, 'one round lighter').toBe(BASE_AMMO + 1);
    expect(size(state.bullets), 'and one bullet away').toBe(1);
  });

  it('should do nothing when the gun is empty', () => {
    const state: GameState = {
      ...createArmedState(createTestLevel(), SHOOTER_LEFT, 0),
      ammo: 0,
    };

    expect(removeUpdateTime(nextShot(state))).toEqual(removeUpdateTime(state));
  });

  it('should send the bullet the way the player faces when they shoot', () => {
    const rightward = nextShot(nextTurnRight(createShooterState(2)));
    const leftward = nextShot(nextTurnLeft(createShooterState(2)));

    expect(rightward.bullets[0].velocity.x.current).toBeGreaterThan(0);
    expect(leftward.bullets[0].velocity.x.current).toBeLessThan(0);
  });

  it('should fly on through walls and leave the level behind when the bullet is in the air', () => {
    const fired = nextShot(nextTurnLeft(createShooterState(1)));
    const flying = nextTicks(fired, computeTickCount(0.2));

    expect(size(flying.bullets), 'still in the air').toBe(1);

    const flown = nextTicks(flying, computeTickCount(1));

    expect(flown.bullets, 'and it is gone once past the wall').toEqual([]);
  });

  it('should shatter the floor spike and be spent on it when the bullet hits one', () => {
    const fired = nextShot(
      nextTurnLeft(
        createArmedState(createSpikeLevel(SPIKE_COLUMN), SHOOTER_LEFT, 1),
      ),
    );
    const flown = nextTicks(fired, computeTickCount(0.2));

    expect(
      flown.level.tiles[SPIKE_ROW][SPIKE_COLUMN],
      'the spike is gone',
    ).toBe(TILE_AIR);
    expect(flown.bullets, 'and so is the bullet').toEqual([]);
    expect(
      isOverlappingSpike(
        flown.level,
        SPIKE_COLUMN * TILE_SIZE,
        SPIKE_ROW * TILE_SIZE,
        SPIKE_PROBE_SIZE,
        SPIKE_PROBE_SIZE,
      ),
      'nothing is left there to bite',
    ).toBe(false);
  });

  it('should shatter the ceiling spike when it hangs low enough to be hit', () => {
    const fired = nextShot(
      nextTurnLeft(
        createArmedState(
          createCeilingSpikeLevel(SPIKE_COLUMN, SPIKE_ROW),
          SHOOTER_LEFT,
          1,
        ),
      ),
    );
    const flown = nextTicks(fired, computeTickCount(0.2));

    expect(flown.level.tiles[SPIKE_ROW][SPIKE_COLUMN]).toBe(TILE_AIR);
    expect(flown.bullets).toEqual([]);
  });

  it('should keep the shattered spikes gone when the player respawns', () => {
    const fired = nextShot(
      nextTurnLeft(
        createArmedState(createSpikeLevel(SPIKE_COLUMN), SHOOTER_LEFT, 1),
      ),
    );
    const respawned = nextGameState(
      nextTicks(fired, computeTickCount(0.2)),
      {
        type: 'RESPAWN',
      },
      constant(0),
    );

    expect(respawned.level.tiles[SPIKE_ROW][SPIKE_COLUMN]).toBe(TILE_AIR);
  });

  it('should shoot the hanging spike down when it has not dropped yet', () => {
    const level = createTestLevel();
    level.tiles[SPIKE_ROW][SPIKE_COLUMN] = TILE_SPIKE_FALLING;
    const fired = nextShot(
      nextTurnLeft(createArmedState(level, ENEMY_SPAWN_COLUMN * TILE_SIZE, 1)),
    );

    expect(size(fired.fallingSpikes), 'still hanging').toBe(1);

    const flown = nextTicks(fired, computeTickCount(0.5));

    expect(flown.fallingSpikes, 'the spike is gone').toEqual([]);
    expect(flown.bullets, 'and so is the bullet').toEqual([]);
  });

  it('should drop the enemy and be spent on the kill when the bullet hits one', () => {
    const kinds: EnemyKind[] = ['HOPPING', 'HORNED', 'FLYING'];
    const flown = map(kinds, (kind) =>
      nextTicks(
        nextShot(
          createArmedState(
            createTestLevel([ENEMY_SPAWN]),
            SHOOTER_LEFT,
            1,
            kind,
          ),
        ),
        computeTickCount(0.3),
      ),
    );

    times(size(kinds), (kindIndex) =>
      expect(
        flown[kindIndex].enemies[0].timers.death,
        `the ${kinds[kindIndex]} enemy is down`,
      ).not.toBeNull(),
    );
    times(size(kinds), (kindIndex) =>
      expect(
        flown[kindIndex].bullets,
        `and the ${kinds[kindIndex]} kill spent the bullet`,
      ).toEqual([]),
    );
  });

  it('should cost the player nothing when they shoot an enemy down', () => {
    const level = createTestLevel([ENEMY_SPAWN]);
    const fired = nextShot(createArmedState(level, SHOOTER_LEFT, 1, 'HORNED'));
    const flown = nextTicks(fired, computeTickCount(0.3));

    expect(flown.player.hearts.value, 'no horn ever reached them').toBe(
      BASE_HEARTS,
    );
    expect(flown.status).toBe('PLAYING');
  });

  it('should keep the gun holstered when the chest is open', () => {
    const state: GameState = { ...createShooterState(1), status: 'CHEST' };

    expect(nextShot(state).ammo).toBe(BASE_AMMO + 1);
    expect(nextShot(state).bullets).toEqual([]);
  });

  it('should clear the bullets in the air but keep the rounds left when the player respawns', () => {
    const state = nextGameState(
      nextShot(createShooterState(2)),
      {
        type: 'RESPAWN',
      },
      constant(0),
    );

    expect(state.bullets).toEqual([]);
    expect(state.ammo, 'the spent round stays spent').toBe(BASE_AMMO + 1);
  });

  it('should carry the rounds left over when the next level loads', () => {
    const state = nextGameState(
      nextShot(createShooterState(3)),
      {
        type: 'LOAD_LEVEL',
        level: createTestLevel(),
        levelIndex: 1,
      },
      constant(0),
    );

    expect(state.ammo).toBe(BASE_AMMO + 2);
    expect(state.bullets, 'though the shot in flight is left behind').toEqual(
      [],
    );
  });

  it('should not change the game it was handed when the player shoots', () => {
    const state = createShooterState(2);
    const before = removeUpdateTime(state);

    nextShot(state);

    expect(removeUpdateTime(state)).toEqual(before);
  });
});
