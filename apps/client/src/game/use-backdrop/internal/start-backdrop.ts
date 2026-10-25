import type { Observable, Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { initializeCanvas, patchRef } from '../../canvas';
import { type AnimationFrame, createFixedPulses } from '../../tick';
import type { Backdrop } from '../types/backdrop';
import { watchBackdrop } from './watch-backdrop';

const { nonNullable } = P;

export const startBackdrop = (
  backdrop: Backdrop,
  frames: Observable<AnimationFrame>,
): Subscription | null =>
  match(initializeCanvas(backdrop.cell))
    .with(nonNullable, () =>
      patchRef(
        backdrop.subscription,
        watchBackdrop(backdrop, createFixedPulses(frames)),
      ),
    )
    .otherwise(() => null);
