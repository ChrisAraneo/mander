import type { Cannon } from '@mander/model';

import { paint } from '../canvas';
import { cannonStep } from './cannon-step';

export const drawCannon = (
  context: CanvasRenderingContext2D,
  cannon: Cannon,
): void => paint(context, cannonStep(cannon));
