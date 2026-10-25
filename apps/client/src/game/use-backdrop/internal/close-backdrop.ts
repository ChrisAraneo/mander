import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { closeCanvas } from '../../canvas';
import type { Backdrop } from '../types/backdrop';

export const closeBackdrop = (
  backdrop: Backdrop,
): CanvasRenderingContext2D | null =>
  pipe(
    backdrop,
    (current) => tap(current, () => current.subscription.value?.unsubscribe()),
    (current) => closeCanvas(current.cell),
  );
