import {
  type Action,
  createInitialState,
  type GameState,
  reduce,
  type World,
} from '@mander/engine';
import { generate } from '@mander/generator';
import { renderGame, syncViewport } from '@mander/render';
import {
  animationFrames,
  map,
  merge,
  type Observable,
  pairwise,
  scan,
  Subject,
  type Subscription,
} from 'rxjs';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref, shallowRef } from 'vue';

import { createKeyboard, type Keyboard } from '../input';
import { completeWorld, saveScore } from '../storage';
import type { GameController } from './game-controller';

const startState = (world: World): GameState =>
  createInitialState(world.levels[0], 0, [], world.score);

const tickStream = (): Observable<Action> =>
  animationFrames().pipe(
    pairwise(),
    map(([previous, current]): Action => ({
      type: 'TICK',
      deltaSeconds: (current.timestamp - previous.timestamp) / 1000,
    })),
  );

const syncDebugGlobals = (
  next: GameState,
  dispatch: (action: Action) => void,
): void =>
  match(import.meta.env.DEV)
    .with(true, () => {
      Object.assign(window, { manderState: next, manderDispatch: dispatch });
    })
    .otherwise(() => undefined);

const persistProgress = (
  world: World,
  previous: GameState,
  next: GameState,
): void =>
  match(next.status === 'COMPLETE' && previous.status !== 'COMPLETE')
    .with(true, () =>
      match(next.levelIndex >= world.levels.length - 1)
        .with(true, () => completeWorld(world.name, next.score))
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
  let keyboard: Keyboard | null = null;
  let subscription: Subscription | null = null;

  onMounted(() => {
    const element = canvas.value;
    const context = element?.getContext('2d');
    match({ element, context })
      .with(
        { element: P.nonNullable, context: P.nonNullable },
        ({ element, context }) => {
          saveScore(initial.score);
          keyboard = createKeyboard();

          subscription = merge(tickStream(), keyboard.actions$, actions$)
            .pipe(scan(reduce, initial))
            .subscribe((next) => {
              const previous = state.value;
              state.value = next;
              syncDebugGlobals(next, (action) => actions$.next(action));
              persistProgress(world, previous, next);
              renderGame(context, next, palette, syncViewport(element));
            });
        },
      )
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
