import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';
import { draw } from '../canvas/draw';
import { createBulletStep } from './create-bullet-step';

export const drawBullets = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  draw(context, ...map(state.bullets, (bullet) => createBulletStep(bullet)));
