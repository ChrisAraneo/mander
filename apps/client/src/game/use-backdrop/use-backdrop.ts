import { createWorld } from '@mander/generator';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { animationFrames } from 'rxjs';
import { onMounted, onUnmounted, type Ref } from 'vue';
import { logWorldMeta } from '../debug';
import { closeBackdrop } from './internal/close-backdrop';
import { createBackdrop } from './internal/create-backdrop';
import { startBackdrop } from './internal/start-backdrop';
import type { Backdrop } from './types/backdrop';

export const useBackdrop = (
  day: string,
  canvas: Ref<HTMLCanvasElement | null>,
): Backdrop =>
  pipe(
    new Date(day),
    createWorld,
    (world) =>
      tap(world, () =>
        logWorldMeta(world, window.location.search, console.log),
      ),
    (world) => createBackdrop(world, canvas),
    (backdrop) =>
      tap(backdrop, () =>
        onMounted(() => startBackdrop(backdrop, animationFrames())),
      ),
    (backdrop) =>
      tap(backdrop, () => onUnmounted(() => closeBackdrop(backdrop))),
  );
