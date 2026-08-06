import {
  isAlive,
  type Player,
  PLAYER_DEATH_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '@mander/engine';
import { chain, clamp } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { CanvasStep } from '../canvas/canvas-step';
import {
  arc,
  beginPath,
  clip,
  fill,
  lineTo,
  moveTo,
  rect,
  restore,
  rotate,
  roundRect,
  save,
  scale,
  stroke,
  styled,
  translate,
} from '../canvas/commands';
import { paint, sequence } from '../canvas/paint';
import { outline } from '../stroke/stroke';

const { number } = P;

const HALF_WIDTH = PLAYER_WIDTH / 2;
const HALF_HEIGHT = PLAYER_HEIGHT / 2;
const HEAD_RADIUS = 7;
const HEAD_CENTER_Y = -HALF_HEIGHT + HEAD_RADIUS + 1;
const TORSO_TOP = HEAD_CENTER_Y + HEAD_RADIUS;
const LEG_HEIGHT = 18;
const LEG_TOP = HALF_HEIGHT - LEG_HEIGHT;
const DEATH_SPIN = Math.PI * 0.9;

const groundedLegs = (swing: number): CanvasStep =>
  sequence([
    rect(-7 + swing / 2, LEG_TOP, 5, LEG_HEIGHT),
    rect(2 - swing / 2, LEG_TOP, 5, LEG_HEIGHT),
  ]);

const airborneLegs: CanvasStep = sequence([
  rect(-7, LEG_TOP, 5, LEG_HEIGHT - 3),
  rect(2, LEG_TOP + 3, 5, LEG_HEIGHT - 3),
]);

const legsStep = (isGrounded: boolean, swing: number): CanvasStep =>
  sequence([
    beginPath,
    match(isGrounded)
      .with(true, () => groundedLegs(swing))
      .otherwise(() => airborneLegs),
    outline(),
    styled({ fillStyle: '#3F5A86' }),
    fill,
  ]);

const bodyStep = (swing: number): CanvasStep =>
  sequence([
    beginPath,
    roundRect(-8, TORSO_TOP, 16, LEG_TOP - TORSO_TOP + 4, 5),
    outline(),
    styled({ fillStyle: '#F4762C' }),
    fill,
    styled({ fillStyle: '#E0651F' }),
    beginPath,
    roundRect(-2 - swing / 2, TORSO_TOP + 3, 4, 12, 2),
    fill,
  ]);

const deadEyeStep: CanvasStep = sequence([
  styled({ strokeStyle: '#1C1C28', lineWidth: 1.4 }),
  beginPath,
  moveTo(2.4, HEAD_CENTER_Y - 1.4),
  lineTo(6, HEAD_CENTER_Y + 2.2),
  moveTo(6, HEAD_CENTER_Y - 1.4),
  lineTo(2.4, HEAD_CENTER_Y + 2.2),
  stroke,
]);

const livingEyeStep: CanvasStep = sequence([
  beginPath,
  arc(4.2, HEAD_CENTER_Y + 0.4, 1.5, 0, Math.PI * 2),
  fill,
]);

const eyeStep = (isDying: boolean): CanvasStep =>
  sequence([
    styled({ fillStyle: '#1C1C28' }),
    match(isDying)
      .with(true, () => deadEyeStep)
      .otherwise(() => livingEyeStep),
  ]);

const traceSkull: CanvasStep = sequence([
  beginPath,
  arc(1, HEAD_CENTER_Y, HEAD_RADIUS, 0, Math.PI * 2),
]);

const hairStep: CanvasStep = sequence([
  save,
  traceSkull,
  clip,
  styled({ fillStyle: '#4A3021' }),
  beginPath,
  arc(
    0.5,
    HEAD_CENTER_Y - 1.5,
    HEAD_RADIUS - 0.2,
    Math.PI * 0.95,
    Math.PI * 2.02,
  ),
  fill,
  restore,
]);

const headStep = (isDying: boolean): CanvasStep =>
  sequence([
    traceSkull,
    outline(),
    styled({ fillStyle: '#F2C49B' }),
    fill,
    hairStep,
    eyeStep(isDying),
  ]);

const deathProgress = (death: Player['timers']['death']): number =>
  match(death)
    .with(number, (seconds) => clamp(seconds / PLAYER_DEATH_SECONDS, 0, 1))
    .otherwise(() => 0);

const invincibleAlpha = (player: Player, time: number): number =>
  match(player.timers.invincibility > 0 && isAlive(player))
    .with(true, () => 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(time * 30)))
    .otherwise(() => 1);

export const drawPlayer = (
  context: CanvasRenderingContext2D,
  player: Player,
  time: number,
): void =>
  chain({
    isDying: !isAlive(player),
    progress: deathProgress(player.timers.death),
    facing: match(player.statuses.isFacingRight)
      .with(true, () => 1)
      .otherwise(() => -1),
    swing: match(
      Math.abs(player.velocity.x.current) > 1 && player.statuses.isGrounded,
    )
      .with(true, () => Math.sin(time * 14) * 5)
      .otherwise(() => 0),
  })
    .thru(({ isDying, progress, facing, swing }) =>
      paint(
        context,
        save,
        translate(
          player.position.x + HALF_WIDTH,
          player.position.y + HALF_HEIGHT,
        ),
        styled({
          globalAlpha:
            (1 - progress * progress) * invincibleAlpha(player, time),
        }),
        rotate(-facing * progress * DEATH_SPIN),
        scale(facing, 1),
        legsStep(player.statuses.isGrounded, swing),
        bodyStep(swing),
        headStep(isDying),
        restore,
      ),
    )
    .value();
