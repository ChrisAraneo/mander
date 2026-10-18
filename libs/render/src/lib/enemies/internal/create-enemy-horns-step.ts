import { map } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createEnemyHornStep } from './create-enemy-horn-step';
import type { EnemyPalette } from './types/enemy-palette';

const HORN_X_POSITIONS = [-5, 0, 5];

export const createEnemyHornsStep = (palette: EnemyPalette): CanvasStep =>
  createSequenceStep(
    map(HORN_X_POSITIONS, (hornX) => createEnemyHornStep(hornX, palette)),
  );
