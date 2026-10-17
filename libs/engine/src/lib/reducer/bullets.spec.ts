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
import { chain, type Point } from '@mander/utils';
import {
  ceil,
  head,
  map,
  omit,
  reduce as fold,
  size,
  some,
  times,
} from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { ENEMY_HEIGHT, HORNED_ENEMY_CHANCE } from './enemy/consts';
import { BASE_HEARTS, PLAYER_HEIGHT } from './player/consts';
import { reduce } from './reduce';
import { isOverlappingSpike } from './spike/is-overlapping-spike';
import type { Action } from './types/action';

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

const SURFACE = 12 * TILE_SIZE;

const DELTA_SECONDS = 1 / 60;

const ENEMY_SPAWN: Point = { x: 7, y: 11 };

const SHOOTER_X = 5 * TILE_SIZE;

const computeSimulation = (state: GameState): Omit<GameState, 'updateTime'> =>
  omit(state, 'updateTime');

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

const createTestLevel = (enemies: Point[] = []): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row, rowIndex) =>
    map(row, (symbol, columnIndex) =>
      match(
        some(
          enemies,
          (spawn) => spawn.x === columnIndex && spawn.y === rowIndex,
        ),
      )
        .with(true, () => TILE_ENEMY)
        .otherwise(() => LEGEND[symbol]),
    ),
  ),
  chestItems: CARDS,
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
});

const createSpikeLevel = (column: number): GameLevel =>
  chain(createTestLevel())
    .thru((level): GameLevel => ({
      ...level,
      tiles: map(level.tiles, (row, rowIndex) =>
        map(row, (tile, columnIndex) =>
          match(rowIndex === 11 && columnIndex === column)
            .with(true, () => TILE_SPIKE)
            .otherwise(() => tile),
        ),
      ),
    }))
    .value();

const createCeilingSpikeLevel = (column: number, row: number): GameLevel =>
  chain(createTestLevel())
    .thru((level): GameLevel => ({
      ...level,
      tiles: map(level.tiles, (tiles, rowIndex) =>
        map(tiles, (tile, columnIndex) =>
          match({ isSpikeColumn: columnIndex === column, rowIndex })
            .with({ isSpikeColumn: true, rowIndex: row - 1 }, () => TILE_DIRT)
            .with(
              { isSpikeColumn: true, rowIndex: row },
              () => TILE_SPIKE_CEILING,
            )
            .otherwise(() => tile),
        ),
      ),
    }))
    .value();

const nextTick = (state: GameState): GameState =>
  reduce(state, { type: 'TICK' });

const nextTicks = (state: GameState, tickCount: number): GameState =>
  fold(times(tickCount), (current) => nextTick(current), state);

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
  chain(createInitialState(level, 0, [createAmmoBelt(amount)]))
    .thru((state): GameState => ({
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
    }))
    .thru((state) => nextTick(state))
    .value();

const createShooterState = (amount: number): GameState =>
  createArmedState(createTestLevel(), SHOOTER_X, amount);

const nextShot = (state: GameState): GameState =>
  reduce(state, { type: 'SHOOT' });

const nextTurn = (state: GameState, isRight: boolean): GameState =>
  nextTicks(
    reduce(
      state,
      match(isRight)
        .with(true, (): Action => ({ type: 'MOVE_RIGHT_START' }))
        .otherwise((): Action => ({ type: 'MOVE_LEFT_START' })),
    ),
    3,
  );

describe('bullets', () => {
  it('should load a round for every bullet when the pack holds them', () => {
    expect(createShooterState(3).ammo).toBe(3);
  });

  it('should spend a round and put a bullet in the air when the player shoots', () => {
    const state = nextShot(createShooterState(2));

    expect(state.ammo, 'one round lighter').toBe(1);
    expect(size(state.bullets), 'and one bullet away').toBe(1);
  });

  it('should do nothing when the gun is empty', () => {
    const state = createArmedState(createTestLevel(), SHOOTER_X, 0);

    expect(computeSimulation(nextShot(state))).toEqual(
      computeSimulation(state),
    );
  });

  it('should send the bullet the way the player faces when they shoot', () => {
    const rightward = nextShot(nextTurn(createShooterState(2), true));
    const leftward = nextShot(nextTurn(createShooterState(2), false));

    expect(rightward.bullets[0].velocity.x.current).toBeGreaterThan(0);
    expect(leftward.bullets[0].velocity.x.current).toBeLessThan(0);
  });

  it('should fly on through walls and leave the level behind when the bullet is in the air', () => {
    const fired = nextShot(nextTurn(createShooterState(1), false));
    const flying = nextTicks(fired, computeTickCount(0.2));

    expect(size(flying.bullets), 'still in the air').toBe(1);

    const flown = nextTicks(flying, computeTickCount(1));

    expect(flown.bullets, 'and it is gone once past the wall').toEqual([]);
  });

  it('should shatter the floor spike and be spent on it when the bullet hits one', () => {
    const fired = nextShot(
      nextTurn(createArmedState(createSpikeLevel(3), SHOOTER_X, 1), false),
    );
    const flown = nextTicks(fired, computeTickCount(0.2));

    expect(flown.level.tiles[11][3], 'the spike is gone').toBe(TILE_AIR);
    expect(flown.bullets, 'and so is the bullet').toEqual([]);
    expect(
      isOverlappingSpike(flown.level, 3 * TILE_SIZE, 11 * TILE_SIZE, 1, 1),
      'nothing is left there to bite',
    ).toBe(false);
  });

  it('should shatter the ceiling spike when it hangs low enough to be hit', () => {
    const fired = nextShot(
      nextTurn(
        createArmedState(createCeilingSpikeLevel(3, 11), SHOOTER_X, 1),
        false,
      ),
    );
    const flown = nextTicks(fired, computeTickCount(0.2));

    expect(flown.level.tiles[11][3]).toBe(TILE_AIR);
    expect(flown.bullets).toEqual([]);
  });

  it('should keep the shattered spikes gone when the player respawns', () => {
    const fired = nextShot(
      nextTurn(createArmedState(createSpikeLevel(3), SHOOTER_X, 1), false),
    );
    const respawned = reduce(nextTicks(fired, computeTickCount(0.2)), {
      type: 'RESPAWN',
    });

    expect(respawned.level.tiles[11][3]).toBe(TILE_AIR);
  });

  it('should shoot the hanging spike down when it has not dropped yet', () => {
    const level = createTestLevel();
    level.tiles[11][3] = TILE_SPIKE_FALLING;
    const fired = nextShot(
      nextTurn(createArmedState(level, 8 * TILE_SIZE, 1), false),
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
          createArmedState(createTestLevel([ENEMY_SPAWN]), SHOOTER_X, 1, kind),
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
    const fired = nextShot(createArmedState(level, SHOOTER_X, 1, 'HORNED'));
    const flown = nextTicks(fired, computeTickCount(0.3));

    expect(flown.player.hearts.value, 'no horn ever reached them').toBe(
      BASE_HEARTS,
    );
    expect(flown.status).toBe('PLAYING');
  });

  it('should keep the gun holstered when the chest is open', () => {
    const state: GameState = { ...createShooterState(1), status: 'CHEST' };

    expect(nextShot(state).ammo).toBe(1);
    expect(nextShot(state).bullets).toEqual([]);
  });

  it('should clear the bullets in the air but keep the rounds left when the player respawns', () => {
    const state = reduce(nextShot(createShooterState(2)), { type: 'RESPAWN' });

    expect(state.bullets).toEqual([]);
    expect(state.ammo, 'the spent round stays spent').toBe(1);
  });

  it('should carry the rounds left over when the next level loads', () => {
    const state = reduce(nextShot(createShooterState(3)), {
      type: 'LOAD_LEVEL',
      level: createTestLevel(),
      levelIndex: 1,
    });

    expect(state.ammo).toBe(2);
    expect(state.bullets, 'though the shot in flight is left behind').toEqual(
      [],
    );
  });
});
