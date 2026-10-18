import { map } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import { IRON_DARK } from './consts';
import { createCannonRivetStep } from './create-cannon-rivet-step';

const RIVET_CORNERS: readonly number[][] = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

export const drawCannonRivets: CanvasStep = createSequenceStep([
  createStyleStep({ fillStyle: IRON_DARK }),
  createSequenceStep(
    map(RIVET_CORNERS, ([sideX, sideY]) => createCannonRivetStep(sideX, sideY)),
  ),
]);
