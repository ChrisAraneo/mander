import {
  type Action,
  createInitialState,
  type GameState,
  reduce,
} from '@mander/engine';
import type { Level } from '@mander/model';
import { generate } from '@mander/generator';
import {
  getMidLevelFocus,
  interpolateState,
  renderGame,
  syncViewport,
} from '@mander/render';
import { chain, tapEffect } from '@mander/utils';
import { assign, clamp, noop } from 'lodash-es';
import { scan, type Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref } from 'vue';

import {
  type CanvasCell,
  closeCanvas,
  createCanvasCell,
  drawWithCanvas,
  openCanvas,
} from '../canvas';
import { createFixedPulses, createPulseTicks } from '../tick';
import { BACKDROP_LEVEL } from './consts';

const { nonNullable } = P;

interface BackdropFrame {
  previous: GameState;
  current: GameState;
}

interface BackdropCell extends CanvasCell {
  subscription: Subscription | null;
  frame: BackdropFrame;
}

const getLevelIndex = (levels: Level[]): number =>
  clamp(BACKDROP_LEVEL - 1, 0, levels.length - 1);

const createStartFrame = (state: GameState): BackdropFrame => ({
  previous: state,
  current: state,
});

const keepPlaying = (idle: GameState, next: GameState): GameState =>
  match(next.status)
    .with('PLAYING', () => next)
    .otherwise(() => idle);

/** Only steps reach this stream, so every action makes a new pair to draw across. */
const advance =
  (idle: GameState) =>
  (frame: BackdropFrame, action: Action): BackdropFrame =>
    chain(keepPlaying(idle, reduce(frame.current, action)))
      .thru((current): BackdropFrame => ({ previous: frame.current, current }))
      .value();

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
        void chain(createFixedPulses())
          .thru((pulses$) =>
            assign(cell, {
              subscription: createPulseTicks(pulses$)
                .pipe(scan(advance(idle), createStartFrame(idle)))
                .subscribe((frame) => void assign(cell, { frame }))
                .add(
                  pulses$.subscribe((pulse) =>
                    render(
                      interpolateState(
                        cell.frame.previous,
                        cell.frame.current,
                        pulse.alpha,
                      ),
                    ),
                  ),
                ),
            }),
          )
          .value(),
    )
    .otherwise(noop);

export const useBackdrop = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): void =>
  chain(generate(new Date(day)))
    .thru(({ levels, palette }) => ({
      palette,
      level: levels[getLevelIndex(levels)],
      levelIndex: getLevelIndex(levels),
    }))
    .thru((world) => ({
      ...world,
      idle: createInitialState(world.level, world.levelIndex, []),
      focus: getMidLevelFocus(world.level),
    }))
    .thru((world) => ({
      ...world,
      cell: {
        ...createCanvasCell(),
        subscription: null,
        frame: createStartFrame(world.idle),
      } as BackdropCell,
    }))
    .thru((setup) => ({
      ...setup,
      renderState: (next: GameState): void =>
        drawWithCanvas(setup.cell, canvas, (context, element) =>
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
      tapEffect(setup, () =>
        onMounted(() =>
          startOnMount(setup.cell, canvas, setup.idle, setup.renderState),
        ),
      ),
    )
    .thru((setup) =>
      tapEffect(setup, () =>
        onUnmounted(() =>
          chain(setup.cell)
            .thru((cell) =>
              tapEffect(cell, () => cell.subscription?.unsubscribe()),
            )
            .thru((cell) => closeCanvas(cell))
            .value(),
        ),
      ),
    )
    .thru(noop)
    .value();
