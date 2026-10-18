import { noop, tap } from 'lodash-es';
import type { CanvasCall } from '../types/canvas-call';

export const createRecordedGradient = (
  calls: CanvasCall[],
  name: string,
  args: unknown[],
): CanvasGradient =>
  tap<CanvasGradient>(
    {
      addColorStop: (offset, color) =>
        noop(calls.push({ name: 'addColorStop', args: [offset, color] })),
    },
    () => calls.push({ name, args }),
  );
