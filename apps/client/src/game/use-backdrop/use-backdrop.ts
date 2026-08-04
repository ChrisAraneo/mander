import {
  type Action,
  createInitialState,
  type GameState,
  type Level,
  reduce,
} from '@mander/engine';
import { generate } from '@mander/generator';
import { midLevelFocus, renderGame, syncViewport } from '@mander/render';
import { clamp } from 'lodash-es';
import { scan, type Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref } from 'vue';

import { tickStream } from '../tick';
import { BACKDROP_LEVEL } from './consts';

const levelIndexIn = (levels: Level[]): number =>
  clamp(BACKDROP_LEVEL - 1, 0, levels.length - 1);

const keepPlaying = (idle: GameState, next: GameState): GameState =>
  match(next.status)
    .with('PLAYING', () => next)
    .otherwise(() => idle);

const advance =
  (idle: GameState) =>
  (state: GameState, action: Action): GameState =>
    keepPlaying(idle, reduce(state, action));

export const useBackdrop = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): void => {
  const { levels, palette } = generate(new Date(day));
  const levelIndex = levelIndexIn(levels);
  const level = levels[levelIndex];
  const idle = createInitialState(level, levelIndex, []);
  const focus = midLevelFocus(level);

  let subscription: Subscription | null = null;
  let context: CanvasRenderingContext2D | null = null;

  const renderState = (next: GameState): void =>
    match({ element: canvas.value, context })
      .with(
        { element: P.nonNullable, context: P.nonNullable },
        ({ element, context }) =>
          renderGame(context, next, palette, syncViewport(element), focus),
      )
      .otherwise(() => undefined);

  onMounted(() => {
    const element = canvas.value;
    context = element?.getContext('2d') ?? null;
    match({ element, context })
      .with({ element: P.nonNullable, context: P.nonNullable }, () => {
        subscription = tickStream()
          .pipe(scan(advance(idle), idle))
          .subscribe(renderState);
      })
      .otherwise(() => undefined);
  });

  onUnmounted(() => subscription?.unsubscribe());
};
