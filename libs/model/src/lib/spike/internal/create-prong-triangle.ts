import { PRONG_WIDTH } from '../consts';
import type { Triangle } from '../types/triangle';
import type { ProngEdges } from './types/prong-edges';

export const createProngTriangle = (
  prongLeft: number,
  { base, apex }: ProngEdges,
): Triangle => [
  { x: prongLeft, y: base },
  { x: prongLeft + PRONG_WIDTH / 2, y: apex },
  { x: prongLeft + PRONG_WIDTH, y: base },
];
