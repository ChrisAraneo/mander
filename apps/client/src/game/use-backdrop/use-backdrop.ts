import { createInitialState } from '@mander/engine';
import { createWorld } from '@mander/generator';
import {
  computeInterpolatedState,
  computeMidLevelFocus,
  type RenderedWorld,
} from '@mander/render';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import {
  animationFrames,
  type Observable,
  scan,
  type Subscription,
} from 'rxjs';
import { match, P } from 'ts-pattern';
import { onMounted, onUnmounted, type Ref, shallowRef } from 'vue';
import {
  closeCanvas,
  createCanvasCell,
  drawCanvasGame,
  initializeCanvas,
  patchRef,
} from '../canvas';
import { createFixedPulses, createPulseTicks, type Pulse } from '../tick';
import { computeBackdropLevelIndex } from './internal/compute-backdrop-level-index';
import { createBackdropStartFrame } from './internal/create-backdrop-start-frame';
import { nextBackdropFrame } from './internal/next-backdrop-frame';
import type { Backdrop } from './types/backdrop';

const { nonNullable } = P;

const drawBackdropPulse = (backdrop: Backdrop, pulse: Pulse): void =>
  drawCanvasGame(
    backdrop.cell,
    computeInterpolatedState(
      backdrop.frame.value.previous,
      backdrop.frame.value.current,
      pulse.alpha,
    ),
    backdrop.palette,
    backdrop.focus,
    [],
  );

const watchBackdrop = (
  backdrop: Backdrop,
  pulses: Observable<Pulse>,
): Subscription =>
  tap(
    createPulseTicks(pulses)
      .pipe(
        scan(
          (frame, action) =>
            nextBackdropFrame(frame, action, backdrop.idle, () =>
              performance.now(),
            ),
          createBackdropStartFrame(backdrop.idle),
        ),
      )
      .subscribe((frame) => patchRef(backdrop.frame, frame)),
    (subscription) =>
      subscription.add(
        pulses.subscribe((pulse) => drawBackdropPulse(backdrop, pulse)),
      ),
  );

const startBackdrop = (backdrop: Backdrop): Subscription | null =>
  match(initializeCanvas(backdrop.cell))
    .with(nonNullable, () =>
      patchRef(
        backdrop.subscription,
        watchBackdrop(backdrop, createFixedPulses(animationFrames())),
      ),
    )
    .otherwise(() => null);

const closeBackdrop = (backdrop: Backdrop): CanvasRenderingContext2D | null =>
  pipe(
    backdrop,
    (current) => tap(current, () => current.subscription.value?.unsubscribe()),
    (current) => closeCanvas(current.cell),
  );

const createBackdrop = (
  world: RenderedWorld,
  canvas: Ref<HTMLCanvasElement | null>,
): Backdrop =>
  pipe(
    computeBackdropLevelIndex(world.levels),
    (levelIndex) => ({ levelIndex, level: world.levels[levelIndex] }),
    ({ levelIndex, level }) => ({
      level,
      idle: createInitialState(level, levelIndex, []),
    }),
    ({ level, idle }): Backdrop => ({
      cell: createCanvasCell(canvas),
      palette: world.palette,
      focus: computeMidLevelFocus(level),
      idle,
      frame: shallowRef(createBackdropStartFrame(idle)),
      subscription: shallowRef<Subscription | null>(null),
    }),
  );

export const useBackdrop = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): Backdrop =>
  pipe(
    new Date(day),
    createWorld,
    (world) => createBackdrop(world, canvas),
    (backdrop) => tap(backdrop, () => onMounted(() => startBackdrop(backdrop))),
    (backdrop) =>
      tap(backdrop, () => onUnmounted(() => closeBackdrop(backdrop))),
  );
