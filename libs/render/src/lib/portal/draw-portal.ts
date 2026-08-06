import {
  findPortalTile,
  type GameState,
  type Level,
  PORTAL_ENTITY_BOX,
  toEntityRectangle,
} from '@mander/engine';
import type { Rectangle } from '@mander/utils';
import { chain, map, noop, range } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { CanvasStep } from '../canvas/canvas-step';
import {
  beginPath,
  ellipse,
  fill,
  restore,
  save,
  stroke,
  styled,
  styledWith,
} from '../canvas/commands';
import { type ColorStop, radialGradient } from '../canvas/gradient';
import { paint, sequence } from '../canvas/paint';
import { outline } from '../stroke/stroke';

const { nullish } = P;

const GLOW = '#A678FF';
const RING_COLOR = '#B98CFF';
const RING_COUNT = 3;

const SWIRL_STOPS: readonly ColorStop[] = [
  [0, '#E9DCFF'],
  [0.45, '#8D55E0'],
  [1, '#3C2470'],
];

const coreStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
): CanvasStep =>
  sequence([
    beginPath,
    ellipse(
      centerX,
      centerY,
      (portal.width / 2) * pulse,
      (portal.height / 2) * pulse,
      0,
      0,
      Math.PI * 2,
    ),
    outline(),
    styledWith((context) => ({
      fillStyle: radialGradient(
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

const ringStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
  angle: number,
): CanvasStep =>
  sequence([
    beginPath,
    ellipse(
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

const ringsStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
  time: number,
): CanvasStep =>
  sequence([
    styled({ strokeStyle: RING_COLOR, lineWidth: 3 }),
    sequence(
      map(range(RING_COUNT), (ringIndex) =>
        ringStep(
          portal,
          centerX,
          centerY,
          pulse,
          time * 2 + (ringIndex * Math.PI * 2) / RING_COUNT,
        ),
      ),
    ),
  ]);

const portalStep = (portal: Rectangle, state: GameState): CanvasStep =>
  chain({
    centerX: portal.x + portal.width / 2,
    centerY: portal.y + portal.height / 2,
    pulse: 1 + Math.sin(state.time * 3) * 0.05,
  })
    .thru(({ centerX, centerY, pulse }) =>
      sequence([
        save,
        styled({
          shadowColor: GLOW,
          shadowBlur: match(state.isNearPortal)
            .with(true, () => 30)
            .otherwise(() => 14),
        }),
        coreStep(portal, centerX, centerY, pulse),
        ringsStep(portal, centerX, centerY, pulse, state.time),
        restore,
      ]),
    )
    .value();

const portalRectangle = (level: Level): Rectangle | undefined =>
  match(findPortalTile(level))
    .with(nullish, () => undefined)
    .otherwise((tile) => toEntityRectangle(tile, PORTAL_ENTITY_BOX));

export const drawPortal = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  chain(portalRectangle(state.level))
    .thru((portal) =>
      match(portal)
        .with(nullish, noop)
        .otherwise((box) => paint(context, portalStep(box, state))),
    )
    .value();
