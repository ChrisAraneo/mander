import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';

import { paint } from '../canvas';
import { bulletStep } from './bullet-step';

export const drawBullets = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  paint(context, ...map(state.bullets, (bullet) => bulletStep(bullet)));
