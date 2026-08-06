import {
  CHEST_ENTITY_BOX,
  findChestTile,
  type GameState,
  type Level,
  toEntityRectangle,
} from '@mander/engine';
import type { Rectangle } from '@mander/utils';
import { chain, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  beginPath,
  type CanvasStep,
  fill,
  fillRect,
  paint,
  rect,
  restore,
  save,
  sequence,
  styled,
  when,
} from '../canvas';
import { outline } from '../stroke';

const { nullish } = P;

const GLOW = '#FFD166';
const BODY_OPEN = '#7A5A30';
const BODY_CLOSED = '#A97B34';
const LID_OPEN = '#8A683A';
const LID_CLOSED = '#C3913F';
const CAVITY = '#2C2418';
const LATCH = '#E8C15C';
const SHADOW = 'RGBA(0, 0, 0, 0.25)';

const lidStep = (chest: Rectangle, isOpen: boolean): CanvasStep =>
  sequence([
    beginPath,
    match(isOpen)
      .with(true, () => rect(chest.x - 2, chest.y - 6, chest.width + 4, 7))
      .otherwise(() => rect(chest.x - 1, chest.y, chest.width + 2, 9)),
    outline(),
    styled({
      fillStyle: match(isOpen)
        .with(true, () => LID_OPEN)
        .otherwise(() => LID_CLOSED),
    }),
    fill,
    match(isOpen)
      .with(true, () =>
        sequence([
          styled({ fillStyle: CAVITY }),
          fillRect(chest.x + 2, chest.y + 6, chest.width - 4, 5),
        ]),
      )
      .otherwise(() =>
        sequence([
          styled({ fillStyle: LATCH }),
          fillRect(chest.x + chest.width / 2 - 2, chest.y + 6, 4, 7),
        ]),
      ),
  ]);

const chestStep = (chest: Rectangle, state: GameState): CanvasStep =>
  sequence([
    save,
    when(state.isNearChest, styled({ shadowColor: GLOW, shadowBlur: 20 })),
    beginPath,
    rect(chest.x, chest.y + 6, chest.width, chest.height - 6),
    outline(),
    styled({
      fillStyle: match(state.isChestOpened)
        .with(true, () => BODY_OPEN)
        .otherwise(() => BODY_CLOSED),
    }),
    fill,
    lidStep(chest, state.isChestOpened),
    styled({ fillStyle: SHADOW }),
    fillRect(chest.x + 3, chest.y + 6, 2, chest.height - 6),
    fillRect(chest.x + chest.width - 5, chest.y + 6, 2, chest.height - 6),
    restore,
  ]);

const chestRectangle = (level: Level): Rectangle | undefined =>
  match(findChestTile(level))
    .with(nullish, () => undefined)
    .otherwise((tile) => toEntityRectangle(tile, CHEST_ENTITY_BOX));

export const drawChest = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  chain(chestRectangle(state.level))
    .thru((chest) =>
      match(chest)
        .with(nullish, noop)
        .otherwise((box) => paint(context, chestStep(box, state))),
    )
    .value();
