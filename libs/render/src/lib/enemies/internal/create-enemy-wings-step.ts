import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createEnemyWingStep } from './create-enemy-wing-step';

const WING_FLAP_SPEED = 10;

const WING_FLAP_ANGLE = 0.6;

const WING_SIDES = [-1, 1];

export const createEnemyWingsStep = (time: number): CanvasStep =>
  pipe(
    Math.sin(time * WING_FLAP_SPEED) * WING_FLAP_ANGLE,
    (flap) => map(WING_SIDES, (side) => createEnemyWingStep(side, flap)),
    createSequenceStep,
  );
