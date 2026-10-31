import {
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
  type Point,
} from '@mander/model';
import {
  ceil,
  constant,
  filter,
  head,
  isEmpty,
  map,
  reduce,
  size,
  times,
} from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import {
  CANNON_RANGE_TILES,
  CANNON_RELOAD_SECONDS,
  CANNONBALL_SIZE,
  CANNONBALL_SPEED,
} from './cannon/consts';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from './player/consts';

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

const CANNON_TILE: Point = { x: 8, y: 11 };

const CANNON_X = CANNON_TILE.x * TILE_SIZE;

const CANNON_Y = CANNON_TILE.y * TILE_SIZE;

const OUTFIELD = 40;

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

const createTestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: CARDS,
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const nextTicks = (state: GameState, tickCount: number): GameState =>
  reduce(times(tickCount), (current) => nextTick(current), state);

const nextTicksWhile = (
  state: GameState,
  tickLimit: number,
  isTicking: (state: GameState) => boolean,
): GameState =>
  match(tickLimit > 0 && isTicking(state))
    .with(true, () => nextTicksWhile(nextTick(state), tickLimit - 1, isTicking))
    .otherwise(() => state);

const nextTickStates = (state: GameState, tickCount: number): GameState[] =>
  match(tickCount > 0)
    .with(true, () =>
      pipe(state, nextTick, (ticked) => [
        ticked,
        ...nextTickStates(ticked, tickCount - 1),
      ]),
    )
    .otherwise((): GameState[] => []);

const computeTickCount = (seconds: number): number =>
  ceil(seconds / DELTA_SECONDS) + 1;

const patchCannonTile = (level: GameLevel): GameLevel => ({
  ...level,
  tiles: map(level.tiles, (row, rowIndex) =>
    map(row, (tile, columnIndex) =>
      match(rowIndex === CANNON_TILE.y && columnIndex === CANNON_TILE.x)
        .with(true, () => TILE_CANNON)
        .otherwise(() => tile),
    ),
  ),
});

const createCannonLevel = (): GameLevel => patchCannonTile(createTestLevel());

const createStandingState = (level: GameLevel, left: number): GameState =>
  pipe(
    createInitialState(level, 0, []),
    (state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: { x: left, y: SURFACE - PLAYER_HEIGHT },
      },
    }),
    (state) => nextTick(state),
  );

const createCannonState = (left = 6 * TILE_SIZE): GameState =>
  createStandingState(createCannonLevel(), left);

const patchOutfieldColumns = (level: GameLevel): GameLevel => ({
  ...level,
  width: level.width + OUTFIELD,
  tiles: map(level.tiles, (row, rowIndex) => [
    ...row,
    ...times(OUTFIELD, (): Tile =>
      match(rowIndex >= 12)
        .with(true, () => TILE_DIRT)
        .otherwise(() => TILE_AIR),
    ),
  ]),
});

const createWideCannonLevel = (): GameLevel =>
  patchOutfieldColumns(createCannonLevel());

const createStateAtRange = (tileCount: number): GameState =>
  createStandingState(
    createWideCannonLevel(),
    CANNON_X + tileCount * TILE_SIZE,
  );

const nextTicksUntilFired = (start: GameState): GameState =>
  nextTicksWhile(start, computeTickCount(CANNON_RELOAD_SECONDS), (state) =>
    isEmpty(state.cannonballs),
  );

const nextTicksUntilStruck = (start: GameState): GameState =>
  nextTicksWhile(
    start,
    computeTickCount(1),
    (state) => state.player.hearts.value >= start.player.hearts.value,
  );

describe('cannons', () => {
  it('should mount one cannon, loaded and waiting, when a tile asks for one', () => {
    const state = createCannonState();

    expect(state.cannons).toHaveLength(1);
    expect(state.cannons[0].position).toEqual({ x: CANNON_X, y: CANNON_Y });
    expect(state.cannonballs).toEqual([]);
  });

  it('should stop the run dead when the player walks into it', () => {
    const start = createCannonState(4 * TILE_SIZE);
    const pressed = nextGameState(
      start,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );
    const moved = nextTicks(pressed, computeTickCount(1));

    expect(moved.player.position.x + PLAYER_WIDTH).toBe(CANNON_X);
  });

  it('should hold the player up and shoot below their feet when they stand on it', () => {
    const start = createCannonState();
    const dropped = {
      ...start,
      player: {
        ...start.player,
        position: { x: CANNON_X + 5, y: CANNON_Y - PLAYER_HEIGHT - 40 },
      },
    };
    const landed = nextTicks(
      dropped,
      computeTickCount(CANNON_RELOAD_SECONDS + 0.5),
    );

    expect(landed.player.statuses.isGrounded, 'landed on the barrel').toBe(
      true,
    );
    expect(landed.player.position.y).toBe(CANNON_Y - PLAYER_HEIGHT);
    expect(
      landed.player.hearts.value,
      'the shot passes under the player standing on it',
    ).toBe(BASE_HEARTS);
  });

  it('should shoot a cannonball when three and a half seconds have passed', () => {
    const start = createCannonState();
    const states = nextTickStates(
      start,
      computeTickCount(CANNON_RELOAD_SECONDS * 3 + 0.5),
    );
    const previousStates = [start, ...states];
    const fired = size(
      filter(
        states,
        (state, tickIndex) =>
          size(state.cannonballs) > size(previousStates[tickIndex].cannonballs),
      ),
    );

    expect(fired).toBe(3);
  });

  it('should hold its fire when the player keeps more than twenty blocks away', () => {
    const start = createStateAtRange(CANNON_RANGE_TILES + 2);
    const waited = nextTicks(
      start,
      computeTickCount(CANNON_RELOAD_SECONDS * 2),
    );

    expect(waited.cannonballs, 'nothing to fear from that far off').toEqual([]);
  });

  it('should shoot when the player closes to twenty blocks', () => {
    const start = createStateAtRange(CANNON_RANGE_TILES + 2);
    const waited = nextTicks(
      start,
      computeTickCount(CANNON_RELOAD_SECONDS * 2),
    );
    const closer = {
      ...waited,
      player: {
        ...waited.player,
        position: {
          x: CANNON_X + (CANNON_RANGE_TILES - 2) * TILE_SIZE,
          y: SURFACE - PLAYER_HEIGHT,
        },
      },
    };
    const fired = nextTicksUntilFired(closer);

    expect(fired.cannonballs).toHaveLength(1);
  });

  it('should spend no reload when the player is out of range', () => {
    const start = createStateAtRange(CANNON_RANGE_TILES + 2);
    const loaded = start.cannons[0].timers.reload;
    const waited = nextTicks(start, computeTickCount(CANNON_RELOAD_SECONDS));

    expect(waited.cannons[0].timers.reload).toBe(loaded);
  });

  it('should turn to face the player when they cross to its other side', () => {
    const start = createCannonState(2 * TILE_SIZE);

    expect(
      start.cannons[0].statuses.isFacingRight,
      'the player is off to its left',
    ).toBe(false);

    const crossed = {
      ...start,
      player: {
        ...start.player,
        position: { x: 20 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    const ticked = nextTick(crossed);

    expect(ticked.cannons[0].statuses.isFacingRight).toBe(true);
  });

  it('should send the shot the way the player went when it fires', () => {
    expect(
      nextTicksUntilFired(createCannonState(2 * TILE_SIZE)).cannonballs[0]
        .velocity.x,
    ).toEqual({ current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED });
    expect(
      nextTicksUntilFired(createCannonState(20 * TILE_SIZE)).cannonballs[0]
        .velocity.x.current,
    ).toBe(CANNONBALL_SPEED);
  });

  it('should fly flat and fast when the cannonball is in the air', () => {
    const fired = nextTicksUntilFired(createCannonState(2 * TILE_SIZE));
    const start = fired.cannonballs[0].position;
    const ticked = nextTicks(fired, 12);
    const flown = ticked.cannonballs[0].position;

    expect(flown.y, 'not a hair of drop').toBe(start.y);
    expect(start.x - flown.x).toBeCloseTo(
      CANNONBALL_SPEED * 12 * DELTA_SECONDS,
    );
  });

  it('should fly on through, keeping to a layer of its own, when the cannonball meets a wall', () => {
    const level = createCannonLevel();
    const wallX = 5 * TILE_SIZE;
    level.tiles[11][5] = TILE_DIRT;
    const fired = nextTicksUntilFired(
      createStandingState(level, 2 * TILE_SIZE),
    );
    const flown = nextTicksWhile(
      fired,
      computeTickCount(1),
      (state) =>
        !isEmpty(state.cannonballs) && state.cannonballs[0].position.x >= wallX,
    );

    expect(size(flown.cannonballs), 'the wall never stopped it').toBe(1);
    expect(flown.cannonballs[0].position.x).toBeLessThan(wallX);
  });

  it('should cost a heart and be spent when the cannonball catches the player', () => {
    const fired = nextTicksUntilFired(createCannonState());

    expect(fired.cannonballs).toHaveLength(1);

    const struck = nextTicksUntilStruck(fired);

    expect(struck.player.hearts.value, 'the hit drains a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(struck.player.timers.invincibility).toBeGreaterThan(0);
    expect(struck.player.timers.death, 'no death, no respawn').toBeNull();
    expect(struck.cannonballs, 'the ball is spent on the hit').toEqual([]);
  });

  it('should end the run when the cannonball takes the last heart', () => {
    const start = createCannonState();
    const lastHeart = {
      ...start,
      player: { ...start.player, hearts: { value: 1 } },
    };
    const struck = nextTicksUntilStruck(nextTicksUntilFired(lastHeart));

    expect(struck.player.hearts.value, 'the last heart is spent').toBe(0);
    expect(struck.status, 'and the run is over').toBe('GAME_OVER');
    expect(struck.player.timers.death).not.toBeNull();
  });

  it('should fly straight through when the player is still glowing with invincibility', () => {
    const struck = nextTicksUntilStruck(
      nextTicksUntilFired(createCannonState()),
    );
    const hearts = struck.player.hearts.value;
    const aimed = {
      ...struck,
      cannonballs: [
        {
          position: {
            x: struck.player.position.x,
            y: struck.player.position.y + PLAYER_HEIGHT / 2,
          },
          velocity: {
            x: { current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED },
          },
        },
      ],
    };
    const ticked = nextTick(aimed);

    expect(ticked.player.hearts.value).toBe(hearts);
    expect(ticked.cannonballs, 'and is not spent on the pass').toHaveLength(1);
  });

  it('should be swept away when the cannonball flies off the end of the level', () => {
    const start = createCannonState();
    const launched = {
      ...start,
      cannonballs: [
        {
          position: { x: 0, y: SURFACE - CANNONBALL_SIZE },
          velocity: {
            x: { current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED },
          },
        },
      ],
    };
    const swept = nextTicks(launched, computeTickCount(0.2));

    expect(swept.cannonballs).toEqual([]);
  });

  it('should reload every cannon and clear the air when the player respawns', () => {
    const fired = nextTicksUntilFired(createCannonState());

    expect(fired.cannonballs).toHaveLength(1);

    const respawned = nextGameState(fired, { type: 'RESPAWN' }, constant(0));

    expect(respawned.cannonballs).toEqual([]);
    expect(respawned.cannons[0].timers.reload).toBe(CANNON_RELOAD_SECONDS);
  });

  it('should mount the cannons of the new level when the next level loads', () => {
    const start = createInitialState(createTestLevel(), 0, []);

    expect(start.cannons).toEqual([]);

    const loaded = nextGameState(
      start,
      {
        type: 'LOAD_LEVEL',
        level: createCannonLevel(),
        levelIndex: 1,
      },
      constant(0),
    );

    expect(loaded.cannons).toHaveLength(1);
  });
});
