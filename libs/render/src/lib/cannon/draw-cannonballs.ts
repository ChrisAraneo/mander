import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';
import { draw } from '../canvas/draw';
import { createCannonballStep } from './create-cannonball-step';

export const drawCannonballs = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  draw(
    context,
    ...map(state.cannonballs, (ball) => createCannonballStep(ball)),
  );
