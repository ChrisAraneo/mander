import {
  type Action,
  createInitialState,
  type GameState,
  reduce,
} from '@mander/engine';
import type { Level } from '@mander/model';
import { generate } from '@mander/generator';
import { midLevelFocus, renderGame, syncViewport } from '@mander/render';
import { chain, withEffect } from '@mander/utils';
import { clamp, noop } from 'lodash-es';
import { scan, type Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref } from 'vue';

import { type CanvasCell, openCanvas, withCanvas } from '../canvas';
import { tickStream } from '../tick';
import { BACKDROP_LEVEL } from './consts';

const { nonNullable } = P;

interface BackdropCell extends CanvasCell {
  subscription: Subscription | null;
}

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

const startOnMount = (
  cell: BackdropCell,
  canvas: Ref<HTMLCanvasElement | null>,
  idle: GameState,
  render: (next: GameState) => void,
): void =>
  match(openCanvas(cell, canvas))
    .with(
      nonNullable,
      () =>
        void Object.assign(cell, {
          subscription: tickStream()
            .pipe(scan(advance(idle), idle))
            .subscribe(render),
        }),
    )
    .otherwise(noop);

export const useBackdrop = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): void =>
  chain(generate(new Date(day)))
    .thru(({ levels, palette }) => ({
      palette,
      level: levels[levelIndexIn(levels)],
      levelIndex: levelIndexIn(levels),
    }))
    .thru((world) => ({
      ...world,
      cell: { context: null, subscription: null } as BackdropCell,
      idle: createInitialState(world.level, world.levelIndex, []),
      focus: midLevelFocus(world.level),
    }))
    .thru((setup) => ({
      ...setup,
      renderState: (next: GameState): void =>
        withCanvas(setup.cell, canvas, (context, element) =>
          renderGame(
            context,
            next,
            setup.palette,
            syncViewport(element),
            setup.focus,
          ),
        ),
    }))
    .thru((setup) =>
      withEffect(setup, () =>
        onMounted(() =>
          startOnMount(setup.cell, canvas, setup.idle, setup.renderState),
        ),
      ),
    )
    .thru((setup) =>
      withEffect(setup, () =>
        onUnmounted(() => setup.cell.subscription?.unsubscribe()),
      ),
    )
    .thru(noop)
    .value();
