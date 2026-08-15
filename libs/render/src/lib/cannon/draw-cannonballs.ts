import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';

import { paint } from '../canvas';
import { cannonballStep } from './cannonball-step';

export const drawCannonballs = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  paint(context, ...map(state.cannonballs, (ball) => cannonballStep(ball)));
