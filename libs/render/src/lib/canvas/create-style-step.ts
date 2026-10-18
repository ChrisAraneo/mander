import { assign } from 'lodash-es';
import type { CanvasStep } from '../types/canvas-step';
import type { CanvasStyle } from './types/canvas-style';

export const createStyleStep =
  (style: CanvasStyle): CanvasStep =>
  (context) =>
    assign(context, style);
