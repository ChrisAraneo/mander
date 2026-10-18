import type { GameState } from '@mander/engine';
import { chain } from '@mander/utils';
import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { draw } from '../canvas/draw';
import { createChestStep } from './internal/create-chest-step';
import { findChestRectangle } from './internal/find-chest-rectangle';

const { nullish } = P;

export const drawChest = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  chain(findChestRectangle(state.level))
    .thru((chest) =>
      match(chest)
        .with(nullish, constant(undefined))
        .otherwise((box) => draw(context, createChestStep(box, state))),
    )
    .value();
