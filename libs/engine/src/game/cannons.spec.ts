import {
  type Cannonball,
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_CANNON_TRIPLE,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import {
  ceil,
  constant,
  every,
  filter,
  head,
  isEmpty,
  map,
  min,
  range,
  reduce,
  round,
  size,
  times,
} from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import {
  CANNON_RANGE_TILES,
  CANNON_RELOAD_SECONDS,
  CANNONBALL_SIZE,
  CANNONBALL_SPEED,
  TRIPLE_CANNON_SHOT_GAP_SECONDS,
} from '../cannon/consts';
import { HORNED_ENEMY_CHANCE } from '../enemy/consts';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createInitialState } from '../start/create-initial-state';
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
const CANNON_COLUMN = 8;
const CANNON_ROW = 11;
const PLAYER_START_COLUMN = 6;
const WALK_START_COLUMN = 4;
const LEFT_OF_CANNON_COLUMN = 2;
const RIGHT_OF_CANNON_COLUMN = 20;
const WALL_COLUMN = 5;
const MID_COLUMN = 10;
const TRIPLE_CANNON_DISTANCE_TILES = 15;
const DEGREES_PER_HALF_TURN = 180;
const SPREAD_DEGREES = 20;
const FOOT_OFFSET = 5;
const DROP_HEIGHT = 40;
const ABOVE_PLAYER = 20;
const FLIGHT_TICKS = 12;
const TRIPLE_RELOAD_RATIO = 1.5;
const JUST_BEFORE_RELOAD_RATIO = 1.4;
const EXTRA_RELOAD_SECONDS = 0.5;
const TRIPLE_CYCLE_SECONDS = 11;
const TRIPLE_SHOT_SECONDS = 7;
const LAST_TRIPLE_FIRING_INDEX = 3;
const CLOSE_DECIMALS = 1;

const SURFACE = SURFACE_ROW * TILE_SIZE;

const DELTA_SECONDS = 1 / 60;

interface CannonCell {
  column: number;
  row: number;
}

const CANNON_TILE: CannonCell = { column: CANNON_COLUMN, row: CANNON_ROW };

const CANNON_X = CANNON_TILE.column * TILE_SIZE;

const CANNON_Y = CANNON_TILE.row * TILE_SIZE;

const OUTFIELD = DROP_HEIGHT;

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
      match(rowIndex === CANNON_TILE.row && columnIndex === CANNON_TILE.column)
        .with(true, () => TILE_CANNON)
        .otherwise(() => tile),
    ),
  ),
});

const createCannonLevel = (): GameLevel => patchCannonTile(createTestLevel());

const createStandingState = (level: GameLevel, left: number): GameState =>
  pipe(
    createInitialState(level, FIRST_LEVEL_INDEX, []),
    (state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: { x: left, y: SURFACE - PLAYER_HEIGHT },
      },
    }),
    nextTick,
  );

const createCannonState = (left = PLAYER_START_COLUMN * TILE_SIZE): GameState =>
  createStandingState(createCannonLevel(), left);

const patchTripleCannonTile = (level: GameLevel): GameLevel => ({
  ...level,
  tiles: map(level.tiles, (row) =>
    map(row, (tile) =>
      match(tile)
        .with(TILE_CANNON, () => TILE_CANNON_TRIPLE)
        .otherwise(() => tile),
    ),
  ),
});

const createTripleCannonState = (): GameState =>
  createStandingState(
    patchTripleCannonTile(createCannonLevel()),
    CANNON_X + TRIPLE_CANNON_DISTANCE_TILES * TILE_SIZE,
  );

const computeDegrees = (radians: number): number =>
  round((radians * DEGREES_PER_HALF_TURN) / Math.PI);

const computeShotDegrees = ({ velocity }: Cannonball): number =>
  computeDegrees(Math.atan2(velocity.y.current, Math.abs(velocity.x.current)));

const computeChangedRoundTicks = (
  previous: GameState[],
  states: GameState[],
): number[] =>
  filter(
    range(size(states)),
    (tick) =>
      states[tick].cannons[0].roundIndex !==
      previous[tick].cannons[0].roundIndex,
  );

const computeFiringTicks = (start: GameState, states: GameState[]): number[] =>
  computeChangedRoundTicks([start, ...states], states);

const patchOutfieldColumns = (level: GameLevel): GameLevel => ({
  ...level,
  width: level.width + OUTFIELD,
  tiles: map(level.tiles, (row, rowIndex) => [
    ...row,
    ...times(OUTFIELD, (): Tile =>
      match(rowIndex >= SURFACE_ROW)
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
  nextTicksWhile(
    start,
    computeTickCount(CANNON_RELOAD_SECONDS * TRIPLE_RELOAD_RATIO),
    (state) => isEmpty(state.cannonballs),
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
    const start = createCannonState(WALK_START_COLUMN * TILE_SIZE);
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
        position: {
          x: CANNON_X + FOOT_OFFSET,
          y: CANNON_Y - PLAYER_HEIGHT - DROP_HEIGHT,
        },
      },
    };
    const landed = nextTicks(
      dropped,
      computeTickCount(CANNON_RELOAD_SECONDS + EXTRA_RELOAD_SECONDS),
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
    const start = createCannonState(LEFT_OF_CANNON_COLUMN * TILE_SIZE);

    expect(
      start.cannons[0].statuses.isFacingRight,
      'the player is off to its left',
    ).toBe(false);

    const crossed = {
      ...start,
      player: {
        ...start.player,
        position: {
          x: RIGHT_OF_CANNON_COLUMN * TILE_SIZE,
          y: SURFACE - PLAYER_HEIGHT,
        },
      },
    };
    const ticked = nextTick(crossed);

    expect(ticked.cannons[0].statuses.isFacingRight).toBe(true);
  });

  it('should send the shot the way the player went when it fires', () => {
    expect(
      nextTicksUntilFired(createCannonState(LEFT_OF_CANNON_COLUMN * TILE_SIZE))
        .cannonballs[0].velocity.x,
    ).toEqual({ current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED });
    expect(
      nextTicksUntilFired(createCannonState(RIGHT_OF_CANNON_COLUMN * TILE_SIZE))
        .cannonballs[0].velocity.x.current,
    ).toBe(CANNONBALL_SPEED);
  });

  it('should fly flat and fast when the cannonball is in the air', () => {
    const fired = nextTicksUntilFired(
      createCannonState(LEFT_OF_CANNON_COLUMN * TILE_SIZE),
    );
    const start = fired.cannonballs[0].position;
    const ticked = nextTicks(fired, FLIGHT_TICKS);
    const flown = ticked.cannonballs[0].position;

    expect(flown.y, 'not a hair of drop').toBe(start.y);
    expect(start.x - flown.x).toBeCloseTo(
      CANNONBALL_SPEED * FLIGHT_TICKS * DELTA_SECONDS,
    );
  });

  it('should fly on through, keeping to a layer of its own, when the cannonball meets a wall', () => {
    const level = createCannonLevel();
    const wallX = WALL_COLUMN * TILE_SIZE;
    level.tiles[CANNON_ROW][WALL_COLUMN] = TILE_DIRT;
    const fired = nextTicksUntilFired(
      createStandingState(level, LEFT_OF_CANNON_COLUMN * TILE_SIZE),
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
            y: { current: 0, max: CANNONBALL_SPEED },
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
            y: { current: 0, max: CANNONBALL_SPEED },
          },
        },
      ],
    };
    const swept = nextTicks(launched, computeTickCount(0.2));

    expect(swept.cannonballs).toEqual([]);
  });

  it('should shoot a single cannonball when a triple cannon has just loaded', () => {
    expect(
      nextTicksUntilFired(createTripleCannonState()).cannonballs,
    ).toHaveLength(1);
  });

  it('should hold the next shot back for the gap when a triple cannon has just fired', () => {
    const fired = nextTicksUntilFired(createTripleCannonState());

    expect(
      nextTicks(fired, computeTickCount(TRIPLE_CANNON_SHOT_GAP_SECONDS - 0.1))
        .cannonballs,
    ).toHaveLength(1);
    expect(
      nextTicks(fired, computeTickCount(TRIPLE_CANNON_SHOT_GAP_SECONDS))
        .cannonballs,
    ).toHaveLength(2);
  });

  it('should shoot upwards, then level, then downwards when a triple cannon has fired all three', () => {
    const fired = nextTicks(
      nextTicksUntilFired(createTripleCannonState()),
      computeTickCount(TRIPLE_CANNON_SHOT_GAP_SECONDS * 2),
    );

    expect(map(fired.cannonballs, computeShotDegrees)).toEqual([
      -SPREAD_DEGREES,
      0,
      SPREAD_DEGREES,
    ]);
  });

  it('should take one and a half times as long to shoot when the cannon is triple', () => {
    const start = createTripleCannonState();
    const ticksBeforeLastReload = computeTickCount(
      CANNON_RELOAD_SECONDS * JUST_BEFORE_RELOAD_RATIO,
    );
    const ticksPastLastReload = computeTickCount(
      CANNON_RELOAD_SECONDS * TRIPLE_RELOAD_RATIO,
    );

    expect(nextTicks(start, ticksBeforeLastReload).cannonballs).toEqual([]);
    expect(nextTicks(start, ticksPastLastReload).cannonballs).toHaveLength(1);
  });

  it('should come round to its first shot again one and a half reloads later when the cannon is triple', () => {
    const start = createTripleCannonState();
    const states = nextTickStates(
      start,
      computeTickCount(TRIPLE_CYCLE_SECONDS),
    );
    const ticks = computeFiringTicks(start, states);

    expect(size(ticks)).toBeGreaterThanOrEqual(LAST_TRIPLE_FIRING_INDEX + 1);
    expect(
      (ticks[LAST_TRIPLE_FIRING_INDEX] - ticks[0]) * DELTA_SECONDS,
    ).toBeCloseTo(CANNON_RELOAD_SECONDS * TRIPLE_RELOAD_RATIO, CLOSE_DECIMALS);
  });

  it('should point the barrel along each shot when a triple cannon fires', () => {
    const start = createTripleCannonState();
    const states = nextTickStates(start, computeTickCount(TRIPLE_SHOT_SECONDS));
    const ticks = computeFiringTicks(start, states);

    expect(
      map(ticks, (tick) => computeDegrees(states[tick].cannons[0].barrelAngle)),
    ).toEqual([-SPREAD_DEGREES, 0, SPREAD_DEGREES]);
  });

  it('should move the barrel before every shot when a triple cannon fires', () => {
    const start = createTripleCannonState();
    const states = nextTickStates(start, computeTickCount(TRIPLE_SHOT_SECONDS));
    const ticks = computeFiringTicks(start, states);
    const turns = map(ticks, (tick) =>
      Math.abs(
        states[tick].cannons[0].barrelAngle -
          states[tick - computeTickCount(0.5)].cannons[0].barrelAngle,
      ),
    );

    expect(size(turns)).toBe(3);
    expect(min(turns)).toBeGreaterThan(0.2);
  });

  it('should swing the barrel back to level when a triple cannon has fired its third shot', () => {
    const fired = nextTicks(
      nextTicksUntilFired(createTripleCannonState()),
      computeTickCount(TRIPLE_CANNON_SHOT_GAP_SECONDS * 2 + 1),
    );

    expect(fired.cannons[0].barrelAngle).toBe(0);
  });

  it('should never move the barrel when the cannon is regular', () => {
    const states = nextTickStates(
      createCannonState(),
      computeTickCount(CANNON_RELOAD_SECONDS * 2),
    );

    expect(every(states, (state) => state.cannons[0].barrelAngle === 0)).toBe(
      true,
    );
  });

  it('should climb as it flies when the first ball of a triple cannon has fired', () => {
    const fired = nextTicksUntilFired(createTripleCannonState());
    const flown = nextTicks(fired, computeTickCount(0.1));

    expect(flown.cannonballs[0].position.y).toBeLessThan(
      fired.cannonballs[0].position.y,
    );
  });

  it('should hurt the player when an angled ball of the triple shot reaches them', () => {
    const start = createTripleCannonState();
    const aimed = {
      ...start,
      cannonballs: [
        {
          position: {
            x: start.player.position.x,
            y: start.player.position.y - ABOVE_PLAYER,
          },
          velocity: {
            x: { current: 0, max: CANNONBALL_SPEED },
            y: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
          },
        },
      ],
    };

    const struck = nextTicksUntilStruck(aimed);

    expect(struck.player.hearts.value).toBe(start.player.hearts.value - 1);
  });

  it('should be swept away when an angled cannonball flies off the top of the level', () => {
    const start = createCannonState();
    const launched = {
      ...start,
      cannonballs: [
        {
          position: { x: MID_COLUMN * TILE_SIZE, y: 0 },
          velocity: {
            x: { current: 0, max: CANNONBALL_SPEED },
            y: { current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED },
          },
        },
      ],
    };

    expect(nextTicks(launched, computeTickCount(0.2)).cannonballs).toEqual([]);
  });

  it('should reload every cannon and clear the air when the player respawns', () => {
    const fired = nextTicksUntilFired(createCannonState());

    expect(fired.cannonballs).toHaveLength(1);

    const respawned = nextGameState(fired, { type: 'RESPAWN' }, constant(0));

    expect(respawned.cannonballs).toEqual([]);
    expect(respawned.cannons[0].timers.reload).toBe(CANNON_RELOAD_SECONDS);
  });

  it('should mount the cannons of the new level when the next level loads', () => {
    const start = createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []);

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

  it('should not change the game it was handed when a tick passes', () => {
    const state = createCannonState();
    const before = createCannonState();

    nextTick(state);

    expect(state).toEqual(before);
  });
});
