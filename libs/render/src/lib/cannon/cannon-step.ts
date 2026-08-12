import { type Cannon, TILE_SIZE } from '@mander/model';
import { chain, clamp, map } from 'lodash-es';
import { match } from 'ts-pattern';

import {
  arc,
  beginPath,
  type CanvasStep,
  fill,
  fillRect,
  linearGradient,
  restore,
  roundRect,
  save,
  scale,
  sequence,
  styled,
  styledWith,
  translate,
  when,
} from '../canvas';
import { outline } from '../stroke';

const HALF_TILE = TILE_SIZE / 2;

const MOUNT_INSET = 1;
const MOUNT_RADIUS = 5;

const RIVET_RADIUS = 1.5;
const RIVET_INSET = 5;

const BARREL_BACK = -5;
const BARREL_LENGTH = HALF_TILE + 7;
const BARREL_HEIGHT = 13;

const MUZZLE_WIDTH = 5;
const MUZZLE_OVERHANG = 2.5;

const TRUNNION_RADIUS = 5;

const CHARGE_RADIUS = 6;
const CHARGE_SECONDS = 0.7;

const IRON = '#454E62';
const IRON_LIGHT = '#6B7690';
const IRON_DARK = '#1D2330';
const BARREL_LIT = '#8892A8';
const CHARGE_COLOR = '#FF9E3D';

const mountStep: CanvasStep = sequence([
  beginPath,
  roundRect(
    -HALF_TILE + MOUNT_INSET,
    -HALF_TILE + MOUNT_INSET,
    TILE_SIZE - MOUNT_INSET * 2,
    TILE_SIZE - MOUNT_INSET * 2,
    MOUNT_RADIUS,
  ),
  outline(),
  styledWith((context) => ({
    fillStyle: linearGradient(context, 0, -HALF_TILE, 0, HALF_TILE, [
      [0, IRON],
      [1, IRON_DARK],
    ]),
  })),
  fill,
  styled({ fillStyle: IRON_LIGHT }),
  fillRect(-HALF_TILE + 4, -HALF_TILE + 3, TILE_SIZE - 8, 3),
]);

const RIVET_CORNERS: readonly number[][] = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

const rivetStep = (sideX: number, sideY: number): CanvasStep =>
  sequence([
    beginPath,
    arc(
      sideX * (HALF_TILE - RIVET_INSET),
      sideY * (HALF_TILE - RIVET_INSET),
      RIVET_RADIUS,
      0,
      Math.PI * 2,
    ),
    fill,
  ]);

const rivetsStep: CanvasStep = sequence([
  styled({ fillStyle: IRON_DARK }),
  sequence(map(RIVET_CORNERS, ([sideX, sideY]) => rivetStep(sideX, sideY))),
]);

const barrelStep: CanvasStep = sequence([
  beginPath,
  roundRect(
    BARREL_BACK,
    -BARREL_HEIGHT / 2,
    BARREL_LENGTH - BARREL_BACK,
    BARREL_HEIGHT,
    3,
  ),
  roundRect(
    BARREL_LENGTH - MUZZLE_WIDTH,
    -BARREL_HEIGHT / 2 - MUZZLE_OVERHANG,
    MUZZLE_WIDTH,
    BARREL_HEIGHT + MUZZLE_OVERHANG * 2,
    2,
  ),
  outline(),
  styledWith((context) => ({
    fillStyle: linearGradient(
      context,
      0,
      -BARREL_HEIGHT / 2,
      0,
      BARREL_HEIGHT / 2,
      [
        [0, BARREL_LIT],
        [0.45, IRON],
        [1, IRON_DARK],
      ],
    ),
  })),
  fill,
]);

const trunnionStep: CanvasStep = sequence([
  beginPath,
  arc(BARREL_BACK + 1, 0, TRUNNION_RADIUS, 0, Math.PI * 2),
  outline(),
  styled({ fillStyle: IRON_LIGHT }),
  fill,
  styled({ fillStyle: IRON_DARK }),
  beginPath,
  arc(BARREL_BACK + 1, 0, TRUNNION_RADIUS / 2.5, 0, Math.PI * 2),
  fill,
]);

const chargeStep = (charge: number): CanvasStep =>
  sequence([
    save,
    styled({
      globalAlpha: charge,
      fillStyle: CHARGE_COLOR,
      shadowColor: CHARGE_COLOR,
      shadowBlur: 10,
    }),
    beginPath,
    arc(BARREL_LENGTH - 1, 0, CHARGE_RADIUS * charge, 0, Math.PI * 2),
    fill,
    restore,
  ]);

const facingOf = (cannon: Cannon): number =>
  match(cannon.statuses.isFacingRight)
    .with(true, () => 1)
    .otherwise(() => -1);

const chargeOf = (cannon: Cannon): number =>
  clamp(1 - cannon.timers.reload / CHARGE_SECONDS, 0, 1);

export const cannonStep = (cannon: Cannon): CanvasStep =>
  chain({ facing: facingOf(cannon), charge: chargeOf(cannon) })
    .thru(({ facing, charge }) =>
      sequence([
        save,
        translate(cannon.position.x + HALF_TILE, cannon.position.y + HALF_TILE),
        mountStep,
        rivetsStep,
        scale(facing, 1),
        barrelStep,
        trunnionStep,
        when(charge > 0, chargeStep(charge)),
        restore,
      ]),
    )
    .value();
