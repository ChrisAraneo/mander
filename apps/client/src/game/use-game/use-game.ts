import {
  Subject,
  animationFrames,
  map,
  merge,
  pairwise,
  scan,
  type Subscription,
} from 'rxjs';
import { onMounted, onUnmounted, shallowRef, type Ref } from 'vue';
import {
  createInitialState,
  reduce,
  type Action,
  type GameState,
} from '@mander/engine';
import { LEVELS_PER_SEED, generateLevel, levelSeed } from '@mander/generator';
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

export function useGame(
  baseSeed: string,
  canvas: Ref<HTMLCanvasElement | null>
): GameController {
  const save = loadSave();
  const startIndex = Math.min(
    firstUncompletedIndex(baseSeed, save.completedLevels),
    LEVELS_PER_SEED - 1
  );
  const initial = createInitialState(
    generateLevel(levelSeed(baseSeed, startIndex), startIndex),
    startIndex,
    save.inventory
  );

  const state = shallowRef(initial);
  const actions$ = new Subject<Action>();
  let keyboard: Keyboard | null = null;
  let subscription: Subscription | null = null;

  onMounted(() => {
    const context = canvas.value?.getContext('2d');
    if (!context) return;
    saveLastSeed(baseSeed);
    const activeKeyboard = (keyboard = createKeyboard());

    const tick$ = animationFrames().pipe(
      pairwise(),
      map(
        ([previous, current]): Action => ({
          type: 'TICK',
          deltaSeconds: (current.timestamp - previous.timestamp) / 1000,
        })
      )
    );

    subscription = merge(tick$, activeKeyboard.actions$, actions$)
      .pipe(scan(reduce, initial))
      .subscribe((next) => {
        const previous = state.value;
        state.value = next;
        if (import.meta.env.DEV) {
          const devWindow = window as {
            __manderState?: GameState;
            __manderDispatch?: (action: Action) => void;
          };
          devWindow.__manderState = next;
          devWindow.__manderDispatch = (action) => actions$.next(action);
        }
        if (next.inventory !== previous.inventory) {
          saveInventory(next.inventory);
        }
        if (next.status === 'complete' && previous.status !== 'complete') {
          markLevelCompleted(next.level.seed);
        }
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
}
