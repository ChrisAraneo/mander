import { identity } from 'lodash-es';

import type { CanvasStep } from './canvas-step';

export const skip: CanvasStep = identity;
