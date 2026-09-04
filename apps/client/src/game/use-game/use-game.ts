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
} from '@mander/engine';
import { generate } from '@mander/generator';
import { renderGame, syncViewport } from '@mander/render';
import { chain, withEffect } from '@mander/utils';
import { assign, noop, size } from 'lodash-es';
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
  closeCanvas,
  createCanvasCell,
  openCanvas,
  setRef,
  withCanvas,
} from '../canvas';
import { createKeyboard, type Keyboard } from '../input';
import { recordPlayedWorld, type RunOutcome, saveScore } from '../storage';
import { tickStream } from '../tick';
import { useReplay, type ReplayController } from '../use-replay';
import type { GameController } from './game-controller';
import { createRunArchive, type RunArchive } from './run-archive';

const { nonNullable } = P;

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
        void assign(window, {
          manderState: next,
          manderDispatch: dispatch,
        }),
    )
    .otherwise(noop);

const isRunOver = (world: GameWorld, state: GameState): boolean =>
  state.status === 'GAME_OVER' ||
  (state.status === 'COMPLETE' && state.levelIndex >= size(world.levels) - 1);

const endOutcome = (state: GameState): RunOutcome =>
  match(state.status)
    .with('GAME_OVER', (): RunOutcome => 'GAME_OVER')
    .otherwise((): RunOutcome => 'COMPLETE');

const persistProgress = (
  world: GameWorld,
  previous: GameState,
  next: GameState,
): void =>
  match(
    next.status === 'COMPLETE' &&
      previous.status !== 'COMPLETE' &&
      next.levelIndex < size(world.levels) - 1,
  )
    .with(true, () => saveScore(next.score))
    .otherwise(noop);

const endRun = (
  world: GameWorld,
  recorder: Recorder,
  archive: RunArchive,
  next: GameState,
): void =>
  match(isRunOver(world, next))
    .with(true, () =>
      archive.keep(
        withEffect(next, () => recorder.stop()),
        endOutcome(next),
      ),
    )
    .otherwise(noop);

const restartRun = (
  recorder: Recorder,
  archive: RunArchive,
  state: GameState,
): void =>
  chain(state)
    .thru((current) =>
      withEffect(current, () => archive.keep(current, 'ABANDONED')),
    )
    .thru((current) => withEffect(current, () => recorder.reset()))
    .thru(() => archive.reset())
    .value();

const capture = (
  recorder: Recorder,
  archive: RunArchive,
  state: ShallowRef<GameState>,
  action: Action,
  timestampMs: number,
): void =>
  chain(action.type)
    .thru((type) =>
      match(type)
        .with('RESTART', () => restartRun(recorder, archive, state.value))
        .otherwise(noop),
    )
    .thru(() => recorder.record(action, timestampMs))
    .value();

const onState =
  (
    state: ShallowRef<GameState>,
    world: GameWorld,
    recorder: Recorder,
    archive: RunArchive,
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
        withEffect(step, () =>
          persistProgress(world, step.previous, step.next),
        ),
      )
      .thru((step) =>
        withEffect(step, () => endRun(world, recorder, archive, step.next)),
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
  actions: Subject<Action>,
  onCapture: (action: Action, timestampMs: number) => void,
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
        .thru((current) => assign(current, { keyboard: createKeyboard() }))
        .thru((current) =>
          assign(current, {
            subscription: merge(
              tickStream(),
              current.keyboard.actions$,
              actions,
            )
              .pipe(
                timestamp(),
                tap(({ value, timestamp: at }) => onCapture(value, at)),
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
      replayOf: (): PackedReplay => packReplay(setup.recorder.snapshot()),
    }))
    .thru((setup) => ({
      ...setup,
      archive: createRunArchive({
        name: setup.world.name,
        day,
        replay: setup.replayOf,
      }),
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
            (action, at) =>
              capture(setup.recorder, setup.archive, setup.state, action, at),
            onState(
              setup.state,
              setup.world,
              setup.recorder,
              setup.archive,
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
              withEffect(cell, () =>
                setup.archive.keep(setup.state.value, 'ABANDONED'),
              ),
            )
            .thru((cell) =>
              withEffect(cell, () => cell.subscription?.unsubscribe()),
            )
            .thru((cell) => withEffect(cell, () => cell.keyboard?.dispose()))
            .thru((cell) => closeCanvas(cell))
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
