import type { Rectangle } from '@mander/model';
import { map, range } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createPortalRingStep } from './create-portal-ring-step';

const RING_COLOR = '#B98CFF';

const RING_COUNT = 3;

const RING_SPIN_SPEED = 2;

export const createPortalRingsStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
  time: number,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ strokeStyle: RING_COLOR, lineWidth: 3 }),
    createSequenceStep(
      map(range(RING_COUNT), (ringIndex) =>
        createPortalRingStep(
          portal,
          centerX,
          centerY,
          pulse,
          time * RING_SPIN_SPEED + (ringIndex * Math.PI * 2) / RING_COUNT,
        ),
      ),
    ),
  ]);
