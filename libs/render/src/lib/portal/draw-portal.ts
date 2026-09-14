import { chain } from '@mander/utils';
import type { GameState } from '@mander/engine';
import {
  findPortalTile,
  getEntityRectangle,
  type Level,
  PORTAL_ENTITY_BOX,
} from '@mander/model';
import type { Rectangle } from '@mander/utils';
import { constant, map, range } from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  applyStyle,
  applyStyleWith,
  beginPath,
  type CanvasStep,
  type ColorStop,
  createRadialGradient,
  fill,
  paint,
  restore,
  save,
  sequence,
  stroke,
  traceEllipse,
} from '../canvas';
import { outline } from '../stroke';

const { nullish } = P;

const GLOW = '#A678FF';
const RING_COLOR = '#B98CFF';
const RING_COUNT = 3;

const SWIRL_STOPS: readonly ColorStop[] = [
  [0, '#E9DCFF'],
  [0.45, '#8D55E0'],
  [1, '#3C2470'],
];

const createCoreStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
): CanvasStep =>
  sequence([
    beginPath,
    traceEllipse(
      centerX,
      centerY,
      (portal.width / 2) * pulse,
      (portal.height / 2) * pulse,
      0,
      0,
      Math.PI * 2,
    ),
    outline(),
    applyStyleWith((context) => ({
      fillStyle: createRadialGradient(
        context,
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        portal.width / 2 + 8,
        SWIRL_STOPS,
      ),
    })),
    fill,
  ]);

const createRingStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
  angle: number,
): CanvasStep =>
  sequence([
    beginPath,
    traceEllipse(
      centerX,
      centerY,
      (portal.width / 2 - 4) * pulse,
      (portal.height / 2 - 6) * pulse,
      0,
      angle,
      angle + Math.PI * 0.6,
    ),
    stroke,
  ]);

const createRingsStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
  time: number,
): CanvasStep =>
  sequence([
    applyStyle({ strokeStyle: RING_COLOR, lineWidth: 3 }),
    sequence(
      map(range(RING_COUNT), (ringIndex) =>
        createRingStep(
          portal,
          centerX,
          centerY,
          pulse,
          time * 2 + (ringIndex * Math.PI * 2) / RING_COUNT,
        ),
      ),
    ),
  ]);

const createPortalStep = (portal: Rectangle, state: GameState): CanvasStep =>
  chain({
    centerX: portal.x + portal.width / 2,
    centerY: portal.y + portal.height / 2,
    pulse: 1 + Math.sin(state.time * 3) * 0.05,
  })
    .thru(({ centerX, centerY, pulse }) =>
      sequence([
        save,
        applyStyle({
          shadowColor: GLOW,
          shadowBlur: match(state.isNearPortal)
            .with(true, () => 30)
            .otherwise(() => 14),
        }),
        createCoreStep(portal, centerX, centerY, pulse),
        createRingsStep(portal, centerX, centerY, pulse, state.time),
        restore,
      ]),
    )
    .value();

const getPortalRectangle = (level: Level): Rectangle | undefined =>
  match(findPortalTile(level))
    .with(nullish, constant(undefined))
    .otherwise((tile) => getEntityRectangle(tile, PORTAL_ENTITY_BOX));

export const drawPortal = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  chain(getPortalRectangle(state.level))
    .thru((portal) =>
      match(portal)
        .with(nullish, constant(undefined))
        .otherwise((box) => paint(context, createPortalStep(box, state))),
    )
    .value();
