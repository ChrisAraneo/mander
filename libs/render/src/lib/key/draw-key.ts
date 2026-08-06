import {
  findKeyTile,
  type GameState,
  KEY_ENTITY_BOX,
  toEntityRectangle,
} from '@mander/engine';
import type { Rectangle } from '@mander/utils';
import { chain, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  arc,
  beginPath,
  type CanvasStep,
  fill,
  lineTo,
  moveTo,
  paint,
  rect,
  restore,
  save,
  sequence,
  stroke,
  styled,
} from '../canvas';
import { outline } from '../stroke';

const { not, nullish } = P;

const KEY_COLOR = '#FFD166';
const KEY_LINE = 3;

const traceKeyBow = (centerX: number, centerY: number): CanvasStep =>
  sequence([
    beginPath,
    arc(centerX, centerY - 5, 4.5, 0, Math.PI * 2),
    moveTo(centerX, centerY - 0.5),
    lineTo(centerX, centerY + 9),
  ]);

const traceKeyTeeth = (centerX: number, centerY: number): CanvasStep =>
  sequence([
    beginPath,
    rect(centerX, centerY + 3, 5, 2.5),
    rect(centerX, centerY + 7, 6, 2.5),
  ]);

const keyGlyphStep = (centerX: number, centerY: number): CanvasStep =>
  sequence([
    traceKeyBow(centerX, centerY),
    outline(KEY_LINE),
    traceKeyTeeth(centerX, centerY),
    outline(),
    styled({ strokeStyle: KEY_COLOR, lineWidth: KEY_LINE }),
    traceKeyBow(centerX, centerY),
    stroke,
    styled({ fillStyle: KEY_COLOR }),
    traceKeyTeeth(centerX, centerY),
    fill,
  ]);

const keyStep = (key: Rectangle, time: number): CanvasStep =>
  chain(Math.sin(time * 3) * 3)
    .thru((bob) => ({
      centerX: key.x + key.width / 2,
      centerY: key.y + key.height / 2 + bob,
    }))
    .thru(({ centerX, centerY }) =>
      sequence([
        save,
        styled({ shadowColor: KEY_COLOR, shadowBlur: 14 }),
        keyGlyphStep(centerX, centerY),
        restore,
      ]),
    )
    .value();

const keyRectangle = (state: GameState): Rectangle | undefined =>
  match({ hasKey: state.hasKey, tile: findKeyTile(state.level) })
    .with({ hasKey: false, tile: not(nullish) }, ({ tile }) =>
      toEntityRectangle(tile, KEY_ENTITY_BOX),
    )
    .otherwise(() => undefined);

export const drawKey = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  chain(keyRectangle(state))
    .thru((key) =>
      match(key)
        .with(nullish, noop)
        .otherwise((box) => paint(context, keyStep(box, state.time))),
    )
    .value();
