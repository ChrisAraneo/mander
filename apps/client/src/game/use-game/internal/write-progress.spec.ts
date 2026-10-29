import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER, Subject, type Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { readSave } from '../../storage';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import { writeProgress } from './write-progress';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
};

const WORLD = {
  name: 'ABC',
  levels: [LEVEL, LEVEL],
  score: 70,
  palette: {},
} as unknown as RenderedWorld;

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

const createState = (patch: Partial<GameState> = {}): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  ...patch,
});

const createGameFixture = (
  storage: Storage | undefined,
  state = shallowRef(createState()),
  recorder = shallowRef(createRecorder('ABC')),
): Game => ({
  world: WORLD,
  day: '2026-09-04',
  storage,
  state,
  frame: shallowRef({ previous: state.value, current: state.value }),
  actions: new Subject<Action>(),
  recorder,
  isRunSaved: shallowRef(false),
  keyboard: shallowRef<Keyboard | null>(null),
  subscription: shallowRef<Subscription | null>(null),
  replay: createReplaySession(
    { kind: 'GAME', recorder, state },
    {
      cell: createCanvasCell(ref(null)),
      palette: WORLD.palette,
      levels: WORLD.levels,
      score: WORLD.score,
      rivals: [],
      frames: NEVER,
    },
  ),
});

describe('writeProgress', () => {
  it('should store the score when a level before the last one is finished', () => {
    const storage = createStorage(new Map());

    const isWritten = writeProgress(
      createGameFixture(storage),
      createState(),
      createState({ status: 'COMPLETE', levelIndex: 0, score: 90 }),
    );

    expect(isWritten).toBe(true);
    expect(readSave(storage).score).toBe(90);
  });

  it('should store nothing when the level is still being played', () => {
    const storage = createStorage(new Map());

    const isWritten = writeProgress(
      createGameFixture(storage),
      createState(),
      createState({ score: 90 }),
    );

    expect(isWritten).toBe(false);
    expect(readSave(storage).score).toBe(0);
  });

  it('should store nothing when the last level is finished', () => {
    const storage = createStorage(new Map());

    const isWritten = writeProgress(
      createGameFixture(storage),
      createState({ levelIndex: 1 }),
      createState({ status: 'COMPLETE', levelIndex: 1, score: 90 }),
    );

    expect(isWritten).toBe(false);
    expect(readSave(storage).score).toBe(0);
  });
});
