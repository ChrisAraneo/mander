import { join, map } from 'lodash-es';
import type { CanvasCall } from '../types/canvas-call';
import { formatCanvasArgument } from './format-canvas-argument';

export const formatCanvasCall = ({ name, args }: CanvasCall): string =>
  `${name}(${join(map(args, formatCanvasArgument), ', ')})`;
