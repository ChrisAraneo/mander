import { chain } from '@mander/model';
import { map } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createEnemyWingStep } from './create-enemy-wing-step';

const WING_FLAP_SPEED = 10;

const WING_FLAP_ANGLE = 0.6;

const WING_SIDES = [-1, 1];

export const createEnemyWingsStep = (time: number): CanvasStep =>
  chain(Math.sin(time * WING_FLAP_SPEED) * WING_FLAP_ANGLE)
    .thru((flap) => map(WING_SIDES, (side) => createEnemyWingStep(side, flap)))
    .thru(createSequenceStep)
    .value();
