import { chain } from '@mander/utils';
import type { GameState } from '@mander/engine';
import { findKeyTile, getEntityRectangle, KEY_ENTITY_BOX } from '@mander/model';
import type { Rectangle } from '@mander/utils';
import { constant, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  applyStyle,
  beginPath,
  type CanvasStep,
  fill,
  moveTo,
  paint,
  restore,
  save,
  sequence,
  stroke,
  traceArc,
  traceLineTo,
  traceRect,
} from '../canvas';
import { outline } from '../stroke';

const { not, nullish } = P;

const KEY_COLOR = '#FFD166';
const KEY_LINE = 3;

const traceKeyBow = (centerX: number, centerY: number): CanvasStep =>
  sequence([
    beginPath,
    traceArc(centerX, centerY - 5, 4.5, 0, Math.PI * 2),
    moveTo(centerX, centerY - 0.5),
    traceLineTo(centerX, centerY + 9),
  ]);

const traceKeyTeeth = (centerX: number, centerY: number): CanvasStep =>
  sequence([
    beginPath,
    traceRect(centerX, centerY + 3, 5, 2.5),
    traceRect(centerX, centerY + 7, 6, 2.5),
  ]);

const createKeyGlyphStep = (centerX: number, centerY: number): CanvasStep =>
  sequence([
    traceKeyBow(centerX, centerY),
    outline(KEY_LINE),
    traceKeyTeeth(centerX, centerY),
    outline(),
    applyStyle({ strokeStyle: KEY_COLOR, lineWidth: KEY_LINE }),
    traceKeyBow(centerX, centerY),
    stroke,
    applyStyle({ fillStyle: KEY_COLOR }),
    traceKeyTeeth(centerX, centerY),
    fill,
  ]);

const createKeyStep = (key: Rectangle, time: number): CanvasStep =>
  chain(Math.sin(time * 3) * 3)
    .thru((bob) => ({
      centerX: key.x + key.width / 2,
      centerY: key.y + key.height / 2 + bob,
    }))
    .thru(({ centerX, centerY }) =>
      sequence([
        save,
        applyStyle({ shadowColor: KEY_COLOR, shadowBlur: 14 }),
        createKeyGlyphStep(centerX, centerY),
        restore,
      ]),
    )
    .value();

const getKeyRectangle = (state: GameState): Rectangle | undefined =>
  match({ hasKey: state.hasKey, tile: findKeyTile(state.level) })
    .with({ hasKey: false, tile: not(nullish) }, ({ tile }) =>
      getEntityRectangle(tile, KEY_ENTITY_BOX),
    )
    .otherwise(constant(undefined));

export const drawKey = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  chain(getKeyRectangle(state))
    .thru((key) =>
      match(key)
        .with(nullish, noop)
        .otherwise((box) => paint(context, createKeyStep(box, state.time))),
    )
    .value();
