import {
  type Action,
  createInitialState,
  type GameState,
  type Level,
  reduce,
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
import {
  loadSave,
  markLevelCompleted,
  saveInventory,
  saveLastSeed,
} from '../storage';
import { firstUncompletedIndex } from './first-uncompleted-index';
import type { GameController } from './game-controller';

const startState = (levels: Level[]): GameState => {
  const save = loadSave();
  const startIndex = Math.min(
    firstUncompletedIndex(levels, save.completedLevels),
    levels.length - 1,
  );

  return createInitialState(levels[startIndex], startIndex, save.inventory);
};

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

const persistProgress = (previous: GameState, next: GameState): void => {
  match(next.inventory !== previous.inventory)
    .with(true, () => saveInventory(next.inventory))
    .otherwise(() => undefined);
  match(next.status === 'COMPLETE' && previous.status !== 'COMPLETE')
    .with(true, () => markLevelCompleted(next.level.seed))
    .otherwise(() => undefined);
};

/**
 * Runs one day of the game. The generator deals the whole day at once, so the
 * levels are built here and then handed out in order — no level is rebuilt on
 * the way to it, and the run cannot drift from the one the date describes.
 */
export const useGame = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): GameController => {
  const { name, levels } = generate(new Date(day));
  const initial = startState(levels);

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
          saveLastSeed(day);
          keyboard = createKeyboard();

          subscription = merge(tickStream(), keyboard.actions$, actions$)
            .pipe(scan(reduce, initial))
            .subscribe((next) => {
              const previous = state.value;
              state.value = next;
              syncDebugGlobals(next, (action) => actions$.next(action));
              persistProgress(previous, next);
              renderGame(context, next, syncViewport(element));
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
  };
};
