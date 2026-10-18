import { map } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createBeartrapSpringStep } from './create-beartrap-spring-step';

const SPRING_SIDES = [-1, 1];

export const drawBeartrapSprings: CanvasStep = createSequenceStep(
  map(SPRING_SIDES, createBeartrapSpringStep),
);
