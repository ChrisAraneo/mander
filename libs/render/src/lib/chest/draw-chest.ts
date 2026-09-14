import { chain } from '@mander/utils';
import type { GameState } from '@mander/engine';
import {
  CHEST_ENTITY_BOX,
  findChestTile,
  getEntityRectangle,
  type Level,
} from '@mander/model';
import type { Rectangle } from '@mander/utils';
import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  applyStyle,
  beginPath,
  type CanvasStep,
  fill,
  fillRect,
  paint,
  restore,
  runWhen,
  save,
  sequence,
  traceRect,
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

const createLidStep = (chest: Rectangle, isOpen: boolean): CanvasStep =>
  sequence([
    beginPath,
    match(isOpen)
      .with(true, () => traceRect(chest.x - 2, chest.y - 6, chest.width + 4, 7))
      .otherwise(() => traceRect(chest.x - 1, chest.y, chest.width + 2, 9)),
    outline(),
    applyStyle({
      fillStyle: match(isOpen)
        .with(true, () => LID_OPEN)
        .otherwise(() => LID_CLOSED),
    }),
    fill,
    match(isOpen)
      .with(true, () =>
        sequence([
          applyStyle({ fillStyle: CAVITY }),
          fillRect(chest.x + 2, chest.y + 6, chest.width - 4, 5),
        ]),
      )
      .otherwise(() =>
        sequence([
          applyStyle({ fillStyle: LATCH }),
          fillRect(chest.x + chest.width / 2 - 2, chest.y + 6, 4, 7),
        ]),
      ),
  ]);

const createChestStep = (chest: Rectangle, state: GameState): CanvasStep =>
  sequence([
    save,
    runWhen(
      state.isNearChest,
      applyStyle({ shadowColor: GLOW, shadowBlur: 20 }),
    ),
    beginPath,
    traceRect(chest.x, chest.y + 6, chest.width, chest.height - 6),
    outline(),
    applyStyle({
      fillStyle: match(state.isChestOpened)
        .with(true, () => BODY_OPEN)
        .otherwise(() => BODY_CLOSED),
    }),
    fill,
    createLidStep(chest, state.isChestOpened),
    applyStyle({ fillStyle: SHADOW }),
    fillRect(chest.x + 3, chest.y + 6, 2, chest.height - 6),
    fillRect(chest.x + chest.width - 5, chest.y + 6, 2, chest.height - 6),
    restore,
  ]);

const getChestRectangle = (level: Level): Rectangle | undefined =>
  match(findChestTile(level))
    .with(nullish, constant(undefined))
    .otherwise((tile) => getEntityRectangle(tile, CHEST_ENTITY_BOX));

export const drawChest = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  chain(getChestRectangle(state.level))
    .thru((chest) =>
      match(chest)
        .with(nullish, constant(undefined))
        .otherwise((box) => paint(context, createChestStep(box, state))),
    )
    .value();
