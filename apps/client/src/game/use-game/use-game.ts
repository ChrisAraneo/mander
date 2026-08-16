import {
  type Action,
  createInitialState,
  createRecorder,
  type GameState,
  type GameWorld,
  type PackedReplay,
  packReplay,
  type Recorder,
  reduce,
  totalTime,
} from '@mander/engine';
import { generate } from '@mander/generator';
import { renderGame, syncViewport } from '@mander/render';
import { chain, withEffect } from '@mander/utils';
import { noop, size } from 'lodash-es';
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
import {
  onMounted,
  onUnmounted,
  type Ref,
  type ShallowRef,
  shallowRef,
} from 'vue';

import {
  type CanvasCell,
  createCanvasCell,
  openCanvas,
  setRef,
  withCanvas,
} from '../canvas';
import { createKeyboard, type Keyboard } from '../input';
import { completeWorld, recordPlayedWorld, saveScore } from '../storage';
import { tickStream } from '../tick';
import { useReplay, type ReplayController } from '../use-replay';
import type { GameController } from './game-controller';

const { nonNullable } = P;

interface Run {
  world: GameWorld;
  day: string;
  replay: () => PackedReplay;
}

/** Everything the composable owns for the lifetime of the mounted canvas. */
interface GameCell extends CanvasCell {
  keyboard: Keyboard | null;
  subscription: Subscription | null;
}

const startState = (world: GameWorld): GameState =>
  createInitialState(world.levels[0], 0, [], world.score);

const syncDebugGlobals = (
  next: GameState,
  dispatch: (action: Action) => void,
): void =>
  match(import.meta.env.DEV)
    .with(
      true,
      () =>
        void Object.assign(window, {
          manderState: next,
          manderDispatch: dispatch,
        }),
    )
    .otherwise(noop);

const isRunOver = (world: GameWorld, state: GameState): boolean =>
  state.status === 'GAME_OVER' ||
  (state.status === 'COMPLETE' && state.levelIndex >= size(world.levels) - 1);

const persistProgress = (
  run: Run,
  previous: GameState,
  next: GameState,
): void =>
  match(next.status === 'COMPLETE' && previous.status !== 'COMPLETE')
    .with(true, () =>
      match(next.levelIndex >= size(run.world.levels) - 1)
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
    .otherwise(noop);

/** A RESTART starts a fresh recording; everything else is appended to it. */
const capture = (
  recorder: Recorder,
  action: Action,
  timestampMs: number,
): void =>
  chain(action.type)
    .thru((type) =>
      match(type)
        .with('RESTART', () => recorder.reset())
        .otherwise(noop),
    )
    .thru(() => recorder.record(action, timestampMs))
    .value();

const onState =
  (
    state: ShallowRef<GameState>,
    run: Run,
    recorder: Recorder,
    replay: ReplayController,
    render: (next: GameState) => void,
    dispatch: (action: Action) => void,
  ) =>
  (next: GameState): void =>
    chain({ previous: state.value, next })
      .thru((step) => withEffect(step, () => setRef(state, step.next)))
      .thru((step) =>
        withEffect(step, () => syncDebugGlobals(step.next, dispatch)),
      )
      .thru((step) =>
        withEffect(step, () => persistProgress(run, step.previous, step.next)),
      )
      .thru((step) =>
        withEffect(step, () =>
          match(isRunOver(run.world, step.next))
            .with(true, () => recorder.stop())
            .otherwise(noop),
        ),
      )
      .thru((step) =>
        match(replay.isActive.value)
          .with(true, noop)
          .otherwise(() => render(step.next)),
      )
      .value();

const startOnMount = (
  cell: GameCell,
  canvas: Ref<HTMLCanvasElement | null>,
  world: GameWorld,
  day: string,
  initial: GameState,
  actions$: Subject<Action>,
  recorder: Recorder,
  onNext: (next: GameState) => void,
): void =>
  match(openCanvas(cell, canvas))
    .with(nonNullable, () =>
      chain(withEffect(cell, () => saveScore(initial.score)))
        .thru((current) =>
          withEffect(current, () =>
            recordPlayedWorld({ name: world.name, day }),
          ),
        )
        .thru((current) =>
          Object.assign(current, { keyboard: createKeyboard() }),
        )
        .thru((current) =>
          Object.assign(current, {
            subscription: merge(
              tickStream(),
              current.keyboard.actions$,
              actions$,
            )
              .pipe(
                timestamp(),
                tap(({ value, timestamp: at }) => capture(recorder, value, at)),
                map(({ value }) => value),
                scan(reduce, initial),
              )
              .subscribe(onNext),
          }),
        )
        .thru(noop)
        .value(),
    )
    .otherwise(noop);

export const useGame = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): GameController =>
  chain(generate(new Date(day)))
    .thru((world) => ({
      world,
      initial: startState(world),
      cell: {
        ...createCanvasCell(),
        keyboard: null,
        subscription: null,
      } as GameCell,
      actions$: new Subject<Action>(),
      recorder: createRecorder(world.name),
    }))
    .thru((setup) => ({
      ...setup,
      state: shallowRef(setup.initial),
      dispatch: (action: Action): void => setup.actions$.next(action),
      run: {
        world: setup.world,
        day,
        replay: (): PackedReplay => packReplay(setup.recorder.snapshot()),
      } satisfies Run,
    }))
    .thru((setup) => ({
      ...setup,
      renderState: (next: GameState): void =>
        withCanvas(setup.cell, canvas, (context, element) =>
          renderGame(context, next, setup.world.palette, syncViewport(element)),
        ),
    }))
    .thru((setup) => ({
      ...setup,
      replay: useReplay({
        replay: () => setup.recorder.snapshot(),
        initialState: () => startState(setup.world),
        render: setup.renderState,
        onStop: () => setup.renderState(setup.state.value),
      }),
    }))
    .thru((setup) =>
      withEffect(setup, () =>
        onMounted(() =>
          startOnMount(
            setup.cell,
            canvas,
            setup.world,
            day,
            setup.initial,
            setup.actions$,
            setup.recorder,
            onState(
              setup.state,
              setup.run,
              setup.recorder,
              setup.replay,
              setup.renderState,
              setup.dispatch,
            ),
          ),
        ),
      ),
    )
    .thru((setup) =>
      withEffect(setup, () =>
        onUnmounted(() =>
          chain(setup.cell)
            .thru((cell) =>
              withEffect(cell, () => cell.subscription?.unsubscribe()),
            )
            .thru((cell) => cell.keyboard?.dispose())
            .value(),
        ),
      ),
    )
    .thru((setup): GameController => ({
      state: setup.state,
      worldName: setup.world.name,
      levelCount: size(setup.world.levels),
      replay: setup.replay,
      dispatch: setup.dispatch,
      nextLevel: () =>
        chain(setup.state.value.levelIndex + 1)
          .thru((index) =>
            match(index >= size(setup.world.levels))
              .with(true, noop)
              .otherwise(() =>
                setup.actions$.next({
                  type: 'LOAD_LEVEL',
                  level: setup.world.levels[index],
                  levelIndex: index,
                }),
              ),
          )
          .value(),
      restart: () =>
        chain(setup.world.levels[0])
          .thru((level) => withEffect(level, () => saveScore(0)))
          .thru((level) => setup.actions$.next({ type: 'RESTART', level }))
          .value(),
    }))
    .value();
