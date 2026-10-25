import { createInitialState } from '@mander/engine';
import { computeMidLevelFocus, type RenderedWorld } from '@mander/render';
import { pipe } from 'remeda';
import type { Subscription } from 'rxjs';
import { type Ref, shallowRef } from 'vue';
import { createCanvasCell } from '../../canvas';
import type { Backdrop } from '../types/backdrop';
import { computeBackdropLevelIndex } from './compute-backdrop-level-index';
import { createBackdropStartFrame } from './create-backdrop-start-frame';

export const createBackdrop = (
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
