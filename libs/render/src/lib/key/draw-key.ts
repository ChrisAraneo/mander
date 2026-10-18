import type { GameState } from '@mander/engine';
import { chain } from '@mander/utils';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { draw } from '../canvas/draw';
import { createKeyStep } from './internal/create-key-step';
import { findKeyRectangle } from './internal/find-key-rectangle';

const { nullish } = P;

export const drawKey = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  chain(findKeyRectangle(state))
    .thru((key) =>
      match(key)
        .with(nullish, noop)
        .otherwise((box) => draw(context, createKeyStep(box, state.time))),
    )
    .value();
