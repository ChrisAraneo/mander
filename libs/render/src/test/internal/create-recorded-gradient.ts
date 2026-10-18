import { tapEffect } from '@mander/utils';
import { noop } from 'lodash-es';
import type { CanvasCall } from '../types/canvas-call';

export const createRecordedGradient = (
  calls: CanvasCall[],
  name: string,
  args: unknown[],
): CanvasGradient =>
  tapEffect<CanvasGradient>(
    {
      addColorStop: (offset, color) =>
        noop(calls.push({ name: 'addColorStop', args: [offset, color] })),
    },
    () => calls.push({ name, args }),
  );
