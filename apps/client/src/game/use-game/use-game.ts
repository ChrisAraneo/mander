import {
  type Action,
  addRecordedAction,
  createRecorder,
  finishRecording,
  type GameState,
  type RecorderState,
  serializeReplay,
  toReplay,
} from '@mander/engine';
import { createWorld } from '@mander/generator';
import { computeInterpolatedState, type RenderedWorld } from '@mander/render';
import { assign, noop, tap } from 'lodash-es';
import { pipe } from 'remeda';
import {
  animationFrames,
  merge,
  type Observable,
  scan,
  Subject,
  type Subscription,
  tap as tapStream,
} from 'rxjs';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref, shallowRef } from 'vue';
import {
  closeCanvas,
  createCanvasCell,
  initializeCanvas,
  patchRef,
} from '../canvas';
import { logWorldMeta } from '../debug';
import { closeKeyboard, createKeyboard, type Keyboard } from '../input';
import {
  type FinishedRun,
  findGhostRuns,
  readSave,
  type RunOutcome,
  tryGetLocalStorage,
  writePlayedWorld,
  writeRun,
  writeScore,
} from '../storage';
import { createFixedPulses, createPulseTicks, type Pulse } from '../tick';
import { createStartState, drawStageState, useReplay } from '../use-replay';
import { addGameAction } from './add-game-action';
import { computeRunSeconds } from './internal/compute-run-seconds';
import { createFinishedRun } from './internal/create-finished-run';
import { createGameStartFrame } from './internal/create-game-start-frame';
import { isRunOver } from './internal/is-run-over';
import { nextGameFrame } from './internal/next-game-frame';
import { shouldWriteRun } from './internal/should-write-run';
import { shouldWriteScore } from './internal/should-write-score';
import { toRunOutcome } from './internal/to-run-outcome';
import type { Game } from './types/game';
import type { GameFrame } from './types/game-frame';

const { nonNullable } = P;

const writeDebugGlobals = (game: Game): Window =>
  assign(window, {
    manderState: game.state.value,
    manderDispatch: (action: Action): void => addGameAction(game, action),
  });

const patchDebugGlobals = (game: Game): Game =>
  match(import.meta.env.DEV)
    .with(true, () => tap(game, writeDebugGlobals))
    .otherwise(() => game);

const writeFinishedRun = (game: Game, run: FinishedRun): boolean =>
  pipe(
    run,
    (finished) => tap(finished, () => patchRef(game.isRunSaved, true)),
    (finished) =>
      writeRun(finished, new Date().toISOString(), Math.random, game.storage),
  );

const writeGameRun = (
  game: Game,
  state: GameState,
  outcome: RunOutcome,
): boolean =>
  pipe(
    computeRunSeconds(state),
    (seconds) => ({
      seconds,
      isWriting: shouldWriteRun(game.isRunSaved.value, outcome, seconds),
    }),
    ({ seconds, isWriting }) =>
      match(isWriting)
        .with(true, () =>
          writeFinishedRun(
            game,
            createFinishedRun(
              state,
              outcome,
              seconds,
              game.world.name,
              game.day,
              serializeReplay(toReplay(game.recorder.value)),
            ),
          ),
        )
        .otherwise(() => false),
  );

const writeProgress = (
  game: Game,
  previous: GameState,
  next: GameState,
): boolean =>
  match(shouldWriteScore(game.world, previous, next))
    .with(true, () => writeScore(next.score, game.storage))
    .otherwise(() => false);

const finishRun = (game: Game, next: GameState): boolean =>
  match(isRunOver(game.world, next))
    .with(true, () =>
      pipe(
        game,
        (current) =>
          tap(current, () =>
            patchRef(current.recorder, finishRecording(current.recorder.value)),
          ),
        (current) => writeGameRun(current, next, toRunOutcome(next)),
      ),
    )
    .otherwise(() => false);

const startNewRun = (game: Game): boolean =>
  pipe(
    game,
    (current) =>
      tap(current, () =>
        writeGameRun(current, current.state.value, 'ABANDONED'),
      ),
    (current) =>
      tap(current, () =>
        patchRef(
          current.recorder,
          createRecorder(current.recorder.value.worldName),
        ),
      ),
    (current) => patchRef(current.isRunSaved, false),
  );

const handleRecordedAction = (game: Game, action: Action): RecorderState =>
  pipe(
    action,
    (current) =>
      tap(current, () =>
        match(current.type)
          .with('RESTART', () => startNewRun(game))
          .otherwise(noop),
      ),
    (current) =>
      patchRef(game.recorder, addRecordedAction(game.recorder.value, current)),
  );

const handleGameFrame = (game: Game, frame: GameFrame): boolean =>
  pipe(
    { previous: game.state.value, next: frame.current },
    (step) => tap(step, () => patchRef(game.frame, frame)),
    (step) => tap(step, () => patchRef(game.state, step.next)),
    (step) => tap(step, () => patchDebugGlobals(game)),
    (step) => tap(step, () => writeProgress(game, step.previous, step.next)),
    (step) => finishRun(game, step.next),
  );

const drawGamePulse = (game: Game, pulse: Pulse): void =>
  match(game.replay.isActive.value)
    .with(true, noop)
    .otherwise(() =>
      drawStageState(
        game.replay.stage,
        computeInterpolatedState(
          game.frame.value.previous,
          game.frame.value.current,
          pulse.alpha,
        ),
        [],
      ),
    );

const watchGame = (
  game: Game,
  keyboard: Keyboard,
  pulses: Observable<Pulse>,
): Subscription =>
  tap(
    merge(createPulseTicks(pulses), keyboard.actions, game.actions)
      .pipe(
        tapStream((action) => handleRecordedAction(game, action)),
        scan(
          (frame, action) =>
            nextGameFrame(frame, action, () => performance.now()),
          game.frame.value,
        ),
      )
      .subscribe((frame) => handleGameFrame(game, frame)),
    (subscription) =>
      subscription.add(pulses.subscribe((pulse) => drawGamePulse(game, pulse))),
  );

const startGame = (game: Game): Subscription | null =>
  match(initializeCanvas(game.replay.stage.cell))
    .with(nonNullable, () =>
      pipe(
        game,
        (current) =>
          tap(current, () => writeScore(current.world.score, current.storage)),
        (current) =>
          tap(current, () =>
            writePlayedWorld(
              { name: current.world.name, day: current.day },
              new Date().toISOString(),
              current.storage,
            ),
          ),
        (current) => ({ game: current, keyboard: createKeyboard(window) }),
        (setup) =>
          tap(setup, () => patchRef(setup.game.keyboard, setup.keyboard)),
        (setup) =>
          patchRef(
            setup.game.subscription,
            watchGame(
              setup.game,
              setup.keyboard,
              createFixedPulses(animationFrames()),
            ),
          ),
      ),
    )
    .otherwise(() => null);

const closeGame = (game: Game): CanvasRenderingContext2D | null =>
  pipe(
    game,
    (current) =>
      tap(current, () =>
        writeGameRun(current, current.state.value, 'ABANDONED'),
      ),
    (current) => tap(current, () => current.subscription.value?.unsubscribe()),
    (current) =>
      tap(current, () =>
        match(current.keyboard.value)
          .with(nonNullable, closeKeyboard)
          .otherwise(noop),
      ),
    (current) => closeCanvas(current.replay.stage.cell),
  );

const createGame = (
  world: RenderedWorld,
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
  storage: Storage | undefined,
): Game =>
  pipe(
    createStartState(world.levels, world.score),
    (initial) => ({
      initial,
      state: shallowRef(initial),
      recorder: shallowRef(createRecorder(world.name)),
    }),
    ({ initial, state, recorder }): Game => ({
      world,
      day,
      storage,
      state,
      frame: shallowRef(createGameStartFrame(initial)),
      actions: new Subject<Action>(),
      recorder,
      isRunSaved: shallowRef(false),
      keyboard: shallowRef<Keyboard | null>(null),
      subscription: shallowRef<Subscription | null>(null),
      replay: useReplay(
        { kind: 'GAME', recorder, state },
        {
          cell: createCanvasCell(canvas),
          palette: world.palette,
          levels: world.levels,
          score: world.score,
          rivals: findGhostRuns(readSave(storage), world.name, ''),
          frames: animationFrames(),
        },
      ),
    }),
  );

export const useGame = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): Game =>
  pipe(
    new Date(day),
    createWorld,
    (world) =>
      tap(world, () =>
        logWorldMeta(world, window.location.search, console.log),
      ),
    (world) => createGame(world, day, canvas, tryGetLocalStorage()),
    (game) => tap(game, () => onMounted(() => startGame(game))),
    (game) => tap(game, () => onUnmounted(() => closeGame(game))),
  );
