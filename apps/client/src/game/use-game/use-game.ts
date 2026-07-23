import {
  type Action,
  createInitialState,
  type GameState,
  reduce,
} from '@mander/engine';
import { generateLevel, LEVELS_PER_SEED, levelSeed } from '@mander/generator';
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
import { onMounted, onUnmounted, type Ref, shallowRef } from 'vue';

import { createKeyboard, type Keyboard } from '../input';
import { renderGame } from '../render';
import {
  loadSave,
  markLevelCompleted,
  saveInventory,
  saveLastSeed,
} from '../storage';
import { firstUncompletedIndex } from './first-uncompleted-index';
import type { GameController } from './game-controller';

const startState = (baseSeed: string): GameState => {
  const save = loadSave();
  const startIndex = Math.min(
    firstUncompletedIndex(baseSeed, save.completedLevels),
    LEVELS_PER_SEED - 1,
  );
  return createInitialState(
    generateLevel(levelSeed(baseSeed, startIndex), startIndex),
    startIndex,
    save.inventory,
  );
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
): void => {
  if (!import.meta.env.DEV) return;
  Object.assign(window, { manderState: next, manderDispatch: dispatch });
};

const persistProgress = (previous: GameState, next: GameState): void => {
  if (next.inventory !== previous.inventory) saveInventory(next.inventory);
  if (next.status === 'complete' && previous.status !== 'complete') {
    markLevelCompleted(next.level.seed);
  }
};

export const useGame = (
  baseSeed: string,
  canvas: Ref<HTMLCanvasElement | null>,
): GameController => {
  const initial = startState(baseSeed);

  const state = shallowRef(initial);
  const actions$ = new Subject<Action>();
  let keyboard: Keyboard | null = null;
  let subscription: Subscription | null = null;

  onMounted(() => {
    const context = canvas.value?.getContext('2d');
    if (!context) return;
    saveLastSeed(baseSeed);
    keyboard = createKeyboard();

    subscription = merge(tickStream(), keyboard.actions$, actions$)
      .pipe(scan(reduce, initial))
      .subscribe((next) => {
        const previous = state.value;
        state.value = next;
        syncDebugGlobals(next, (action) => actions$.next(action));
        persistProgress(previous, next);
        renderGame(context, next);
      });
  });

  onUnmounted(() => {
    subscription?.unsubscribe();
    keyboard?.dispose();
  });

  return {
    state,
    dispatch: (action) => actions$.next(action),
    nextLevel: () => {
      const index = state.value.levelIndex + 1;
      if (index >= LEVELS_PER_SEED) return;
      actions$.next({
        type: 'LOAD_LEVEL',
        level: generateLevel(levelSeed(baseSeed, index), index),
        levelIndex: index,
      });
    },
  };
};
