import {
  type Action,
  createInitialState,
  createRecorder,
  type GameState,
  type GameWorld,
  type PackedReplay,
  encodeReplay,
  type Recorder,
  reduce,
  type Replay,
  decodeReplay,
} from '@mander/engine';
import { generate } from '@mander/generator';
import { chain } from '@mander/model';
import {
  getPlayerFocus,
  interpolateState,
  renderGame,
  syncViewport,
} from '@mander/render';
import { assign, noop, size, tap } from 'lodash-es';
import { merge, scan, Subject, type Subscription, tap as tapStream } from 'rxjs';
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
  drawWithCanvas,
  openCanvas,
  setRef,
} from '../canvas';
import { logWorldMeta } from '../debug';
import { createKeyboard, type Keyboard } from '../input';
import {
  findGhostRuns,
  loadSave,
  recordPlayedWorld,
  type RunOutcome,
  saveScore,
} from '../storage';
import { createFixedPulses, createPulseTicks } from '../tick';
import {
  getLevelGhosts,
  useReplay,
  type ReplayController,
} from '../use-replay';
import type { GameController } from './game-controller';
import { createRunArchive, type RunArchive } from './run-archive';

const { nonNullable } = P;

interface GameFrame {
  previous: GameState;
  current: GameState;
}

interface GameCell extends CanvasCell {
  keyboard: Keyboard | null;
  subscription: Subscription | null;
  frame: GameFrame;
}

const createStartState = (world: GameWorld): GameState =>
  createInitialState(world.levels[0], 0, [], world.score);

const createStartFrame = (state: GameState): GameFrame => ({
  previous: state,
  current: state,
});

const advanceFrame = (frame: GameFrame, action: Action): GameFrame =>
  match(action)
    .with({ type: 'TICK' }, (): GameFrame => ({
      previous: frame.current,
      current: reduce(frame.current, action),
    }))
    .otherwise((): GameFrame => ({
      previous: frame.previous,
      current: reduce(frame.current, action),
    }));

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

const getEndOutcome = (state: GameState): RunOutcome =>
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
      archive.save(
        tap(next, () => recorder.stop()),
        getEndOutcome(next),
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
      tap(current, () => archive.save(current, 'ABANDONED')),
    )
    .thru((current) => tap(current, () => recorder.reset()))
    .thru(() => archive.reset())
    .value();

const capture = (
  recorder: Recorder,
  archive: RunArchive,
  state: ShallowRef<GameState>,
  action: Action,
): void =>
  chain(action.type)
    .thru((type) =>
      match(type)
        .with('RESTART', () => restartRun(recorder, archive, state.value))
        .otherwise(noop),
    )
    .thru(() => recorder.record(action))
    .value();

const createStateHandler =
  (
    cell: GameCell,
    state: ShallowRef<GameState>,
    world: GameWorld,
    recorder: Recorder,
    archive: RunArchive,
    dispatch: (action: Action) => void,
  ) =>
  (frame: GameFrame): void =>
    void chain({ previous: state.value, next: frame.current })
      .thru((step) => tap(step, () => assign(cell, { frame })))
      .thru((step) => tap(step, () => setRef(state, step.next)))
      .thru((step) =>
        tap(step, () => syncDebugGlobals(step.next, dispatch)),
      )
      .thru((step) =>
        tap(step, () => persistProgress(world, step.previous, step.next)),
      )
      .thru((step) =>
        tap(step, () => endRun(world, recorder, archive, step.next)),
      )
      .value();

const createDrawHandler =
  (
    cell: GameCell,
    replay: ReplayController,
    render: (next: GameState) => void,
  ) =>
  (alpha: number): void =>
    match(replay.isActive.value)
      .with(true, noop)
      .otherwise(() =>
        render(
          interpolateState(cell.frame.previous, cell.frame.current, alpha),
        ),
      );

const startOnMount = (
  cell: GameCell,
  canvas: Ref<HTMLCanvasElement | null>,
  world: GameWorld,
  day: string,
  initial: GameState,
  actions: Subject<Action>,
  onCapture: (action: Action) => void,
  onNext: (frame: GameFrame) => void,
  onFrame: (alpha: number) => void,
): void =>
  match(openCanvas(cell, canvas))
    .with(nonNullable, () =>
      chain(tap(cell, () => saveScore(initial.score)))
        .thru((current) =>
          tap(current, () =>
            recordPlayedWorld({ name: world.name, day }),
          ),
        )
        .thru((current) => assign(current, { keyboard: createKeyboard() }))
        .thru((current) => ({ current, pulses$: createFixedPulses() }))
        .thru(({ current, pulses$ }) =>
          assign(current, {
            subscription: merge(
              createPulseTicks(pulses$),
              current.keyboard.actions$,
              actions,
            )
              .pipe(
                tapStream(onCapture),
                scan(advanceFrame, createStartFrame(initial)),
              )
              .subscribe(onNext)
              .add(pulses$.subscribe((pulse) => onFrame(pulse.alpha))),
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
    .thru((world) => tap(world, () => logWorldMeta(world)))
    .thru((world) => ({ world, initial: createStartState(world) }))
    .thru((setup) => ({
      ...setup,
      cell: {
        ...createCanvasCell(),
        keyboard: null,
        subscription: null,
        frame: createStartFrame(setup.initial),
      } as GameCell,
      actions$: new Subject<Action>(),
      recorder: createRecorder(setup.world.name),
      rivals: findGhostRuns(loadSave(), setup.world.name, ''),
    }))
    .thru((setup) => ({
      ...setup,
      state: shallowRef(setup.initial),
      dispatch: (action: Action): void => setup.actions$.next(action),
      getPackedReplay: (): PackedReplay =>
        encodeReplay(setup.recorder.snapshot()),
    }))
    .thru((setup) => ({
      ...setup,
      archive: createRunArchive({
        name: setup.world.name,
        day,
        getReplay: setup.getPackedReplay,
      }),
      renderState: (next: GameState, ghosts: GameState[] = []): void =>
        drawWithCanvas(setup.cell, canvas, (context, element) =>
          renderGame(
            context,
            next,
            setup.world.palette,
            syncViewport(element),
            getPlayerFocus(next),
            getLevelGhosts(next, ghosts),
          ),
        ),
    }))
    .thru((setup) => ({
      ...setup,
      replay: useReplay({
        getReplay: () => setup.recorder.snapshot(),
        getGhosts: (): Replay[] =>
          setup.rivals.map((run) =>
            decodeReplay(run.replay, setup.world.levels),
          ),
        getInitialState: () => createStartState(setup.world),
        render: setup.renderState,
        handleStop: () => setup.renderState(setup.state.value),
      }),
    }))
    .thru((setup) =>
      tap(setup, () =>
        onMounted(() =>
          startOnMount(
            setup.cell,
            canvas,
            setup.world,
            day,
            setup.initial,
            setup.actions$,
            (action) =>
              capture(setup.recorder, setup.archive, setup.state, action),
            createStateHandler(
              setup.cell,
              setup.state,
              setup.world,
              setup.recorder,
              setup.archive,
              setup.dispatch,
            ),
            createDrawHandler(setup.cell, setup.replay, setup.renderState),
          ),
        ),
      ),
    )
    .thru((setup) =>
      tap(setup, () =>
        onUnmounted(() =>
          chain(setup.cell)
            .thru((cell) =>
              tap(cell, () =>
                setup.archive.save(setup.state.value, 'ABANDONED'),
              ),
            )
            .thru((cell) =>
              tap(cell, () => cell.subscription?.unsubscribe()),
            )
            .thru((cell) => tap(cell, () => cell.keyboard?.dispose()))
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
      startNextLevel: () =>
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
          .thru((level) => tap(level, () => saveScore(0)))
          .thru((level) => setup.actions$.next({ type: 'RESTART', level }))
          .value(),
    }))
    .value();
