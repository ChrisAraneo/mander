import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';
import { draw } from '../canvas/draw';
import { createGemStep } from './internal/create-gem-step';

export const drawGems = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  draw(context, ...map(state.gems, (tile) => createGemStep(tile, state.time)));
