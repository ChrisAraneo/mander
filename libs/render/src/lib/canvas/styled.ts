import { assign } from 'lodash-es';

import type { CanvasStep } from './canvas-step';
import type { CanvasStyle } from './canvas-style';

export const styled =
  (style: CanvasStyle): CanvasStep =>
  (context) =>
    assign(context, style);
