import {
  type Action,
  createInitialState,
  createRecorder,
  type GameState,
  type GameWorld,
  type PackedReplay,
  packReplay,
  reduce,
  totalTime,
} from '@mander/engine';
import { generate } from '@mander/generator';
import { renderGame, syncViewport } from '@mander/render';
import {
  map,
  merge,
  scan,
  Subject,
  type Subscription,
  tap,
  timestamp,
} from 'rxjs';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref, shallowRef } from 'vue';

import { createKeyboard, type Keyboard } from '../input';
import { completeWorld, recordPlayedWorld, saveScore } from '../storage';
import { tickStream } from '../tick';
import { useReplay } from '../use-replay';
import type { GameController } from './game-controller';

const startState = (world: GameWorld): GameState =>
  createInitialState(world.levels[0], 0, [], world.score);

const syncDebugGlobals = (
  next: GameState,
  dispatch: (action: Action) => void,
): void =>
  match(import.meta.env.DEV)
    .with(true, () => {
      Object.assign(window, { manderState: next, manderDispatch: dispatch });
    })
    .otherwise(() => undefined);

const isRunOver = (world: GameWorld, state: GameState): boolean =>
  state.status === 'GAME_OVER' ||
  (state.status === 'COMPLETE' && state.levelIndex >= world.levels.length - 1);

interface Run {
  world: GameWorld;
  day: string;
  replay: () => PackedReplay;
}

const persistProgress = (
  run: Run,
  previous: GameState,
  next: GameState,
): void =>
  match(next.status === 'COMPLETE' && previous.status !== 'COMPLETE')
    .with(true, () =>
      match(next.levelIndex >= run.world.levels.length - 1)
        .with(true, () =>
          completeWorld({
            name: run.world.name,
            day: run.day,
            score: next.score,
            seconds: totalTime(next.levelTimes),
            replay: run.replay(),
          }),
        )
        .otherwise(() => saveScore(next.score)),
    )
    .otherwise(() => undefined);

export const useGame = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): GameController => {
  const world = generate(new Date(day));
  const { name, levels, palette } = world;
  const initial = startState(world);

  const state = shallowRef(initial);
  const actions$ = new Subject<Action>();
  const recorder = createRecorder(name);
  const run: Run = {
    world,
    day,
    replay: () => packReplay(recorder.snapshot()),
  };
  let keyboard: Keyboard | null = null;
  let subscription: Subscription | null = null;
  let context: CanvasRenderingContext2D | null = null;

  const renderState = (next: GameState): void =>
    match({ element: canvas.value, context })
      .with(
        { element: P.nonNullable, context: P.nonNullable },
        ({ element, context }) =>
          renderGame(context, next, palette, syncViewport(element)),
      )
      .otherwise(() => undefined);

  const replay = useReplay({
    replay: () => recorder.snapshot(),
    initialState: () => startState(world),
    render: renderState,
    onStop: () => renderState(state.value),
  });

  const capture = (action: Action, timestampMs: number): void => {
    match(action.type)
      .with('RESTART', () => recorder.reset())
      .otherwise(() => undefined);
    recorder.record(action, timestampMs);
  };

  onMounted(() => {
    const element = canvas.value;
    context = element?.getContext('2d') ?? null;
    match({ element, context })
      .with({ element: P.nonNullable, context: P.nonNullable }, () => {
        saveScore(initial.score);
        recordPlayedWorld({ name, day });
        keyboard = createKeyboard();

        subscription = merge(tickStream(), keyboard.actions$, actions$)
          .pipe(
            timestamp(),
            tap(({ value, timestamp: at }) => capture(value, at)),
            map(({ value }) => value),
            scan(reduce, initial),
          )
          .subscribe((next) => {
            const previous = state.value;
            state.value = next;
            syncDebugGlobals(next, (action) => actions$.next(action));
            persistProgress(run, previous, next);
            match(isRunOver(world, next))
              .with(true, () => recorder.stop())
              .otherwise(() => undefined);
            match(replay.isActive.value)
              .with(true, () => undefined)
              .otherwise(() => renderState(next));
          });
      })
      .otherwise(() => undefined);
  });

  onUnmounted(() => {
    subscription?.unsubscribe();
    keyboard?.dispose();
  });

  return {
    state,
    worldName: name,
    levelCount: levels.length,
    replay,
    dispatch: (action) => actions$.next(action),
    nextLevel: () => {
      const index = state.value.levelIndex + 1;
      match(index >= levels.length)
        .with(true, () => undefined)
        .otherwise(() =>
          actions$.next({
            type: 'LOAD_LEVEL',
            level: levels[index],
            levelIndex: index,
          }),
        );
    },
    restart: () => {
      saveScore(0);
      actions$.next({ type: 'RESTART', level: levels[0] });
    },
  };
};
