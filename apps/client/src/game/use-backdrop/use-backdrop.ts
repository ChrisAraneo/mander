import {
  type Action,
  createInitialState,
  type GameState,
  reduce,
} from '@mander/engine';
import type { Level } from '@mander/model';
import { generate } from '@mander/generator';
import {
  interpolateState,
  midLevelFocus,
  renderGame,
  syncViewport,
} from '@mander/render';
import { chain, withEffect } from '@mander/utils';
import { assign, clamp, noop } from 'lodash-es';
import { scan, type Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref } from 'vue';

import {
  type CanvasCell,
  closeCanvas,
  createCanvasCell,
  openCanvas,
  withCanvas,
} from '../canvas';
import { fixedPulses, pulseTicks } from '../tick';
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

const levelIndexIn = (levels: Level[]): number =>
  clamp(BACKDROP_LEVEL - 1, 0, levels.length - 1);

const startFrame = (state: GameState): BackdropFrame => ({
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
        void chain(fixedPulses())
          .thru((pulses$) =>
            assign(cell, {
              subscription: pulseTicks(pulses$)
                .pipe(scan(advance(idle), startFrame(idle)))
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
      level: levels[levelIndexIn(levels)],
      levelIndex: levelIndexIn(levels),
    }))
    .thru((world) => ({
      ...world,
      idle: createInitialState(world.level, world.levelIndex, []),
      focus: midLevelFocus(world.level),
    }))
    .thru((world) => ({
      ...world,
      cell: {
        ...createCanvasCell(),
        subscription: null,
        frame: startFrame(world.idle),
      } as BackdropCell,
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
        onUnmounted(() =>
          chain(setup.cell)
            .thru((cell) =>
              withEffect(cell, () => cell.subscription?.unsubscribe()),
            )
            .thru((cell) => closeCanvas(cell))
            .value(),
        ),
      ),
    )
    .thru(noop)
    .value();
