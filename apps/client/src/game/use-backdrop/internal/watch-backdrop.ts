import { tap } from 'lodash-es';
import { type Observable, scan, type Subscription } from 'rxjs';
import { patchRef } from '../../canvas';
import { createPulseTicks, type Pulse } from '../../tick';
import type { Backdrop } from '../types/backdrop';
import { createBackdropStartFrame } from './create-backdrop-start-frame';
import { drawBackdropPulse } from './draw-backdrop-pulse';
import { nextBackdropFrame } from './next-backdrop-frame';

export const watchBackdrop = (
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
