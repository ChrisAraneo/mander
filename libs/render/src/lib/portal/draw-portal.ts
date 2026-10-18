import type { GameState } from '@mander/engine';
import { chain } from '@mander/utils';
import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { draw } from '../canvas/draw';
import { createPortalStep } from './internal/create-portal-step';
import { findPortalRectangle } from './internal/find-portal-rectangle';

const { nullish } = P;

export const drawPortal = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  chain(findPortalRectangle(state.level))
    .thru((portal) =>
      match(portal)
        .with(nullish, constant(undefined))
        .otherwise((box) => draw(context, createPortalStep(box, state))),
    )
    .value();
