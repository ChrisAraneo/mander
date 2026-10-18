import { identity } from 'lodash-es';
import type { CanvasStep } from '../types/canvas-step';

export const drawNothing: CanvasStep = identity;
