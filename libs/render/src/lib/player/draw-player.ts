import {
  isAlive,
  PLAYER_DEATH_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '@mander/engine';
import type { Player } from '@mander/model';
import { chain } from '@mander/utils';
import { clamp } from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  arc,
  beginPath,
  type CanvasStep,
  clip,
  fill,
  lineTo,
  moveTo,
  paint,
  radialGradient,
  rect,
  restore,
  rotate,
  roundRect,
  save,
  scale,
  sequence,
  skip,
  stroke,
  styled,
  styledWith,
  translate,
} from '../canvas';
import { outline } from '../stroke';
import {
  STAR_GLOW_COLOR,
  STAR_GLOW_CORE_COLOR,
  STAR_GLOW_FADE_COLOR,
  STAR_GLOW_FADE_SECONDS,
  STAR_GLOW_INNER_ALPHA,
  STAR_GLOW_PULSE_ALPHA,
  STAR_GLOW_PULSE_RATE,
  STAR_GLOW_RADIUS,
  STAR_GLOW_SQUASH,
} from './consts';
import {
  HURT_PLAYER_COLORS,
  PLAYER_COLORS,
  type PlayerColors,
} from './player-colors';

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

const legsStep = (
  isGrounded: boolean,
  swing: number,
  colors: PlayerColors,
): CanvasStep =>
  sequence([
    beginPath,
    match(isGrounded)
      .with(true, () => groundedLegs(swing))
      .otherwise(() => airborneLegs),
    outline(),
    styled({ fillStyle: colors.legs }),
    fill,
  ]);

const bodyStep = (swing: number, colors: PlayerColors): CanvasStep =>
  sequence([
    beginPath,
    roundRect(-8, TORSO_TOP, 16, LEG_TOP - TORSO_TOP + 4, 5),
    outline(),
    styled({ fillStyle: colors.body }),
    fill,
    styled({ fillStyle: colors.strap }),
    beginPath,
    roundRect(-2 - swing / 2, TORSO_TOP + 3, 4, 12, 2),
    fill,
  ]);

const deadEyeStep = (colors: PlayerColors): CanvasStep =>
  sequence([
    styled({ strokeStyle: colors.eye, lineWidth: 1.4 }),
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

const eyeStep = (isDying: boolean, colors: PlayerColors): CanvasStep =>
  sequence([
    styled({ fillStyle: colors.eye }),
    match(isDying)
      .with(true, () => deadEyeStep(colors))
      .otherwise(() => livingEyeStep),
  ]);

const traceSkull: CanvasStep = sequence([
  beginPath,
  arc(1, HEAD_CENTER_Y, HEAD_RADIUS, 0, Math.PI * 2),
]);

const hairStep = (colors: PlayerColors): CanvasStep =>
  sequence([
    save,
    traceSkull,
    clip,
    styled({ fillStyle: colors.hair }),
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

const headStep = (isDying: boolean, colors: PlayerColors): CanvasStep =>
  sequence([
    traceSkull,
    outline(),
    styled({ fillStyle: colors.skin }),
    fill,
    hairStep(colors),
    eyeStep(isDying, colors),
  ]);

const deathProgress = (death: Player['timers']['death']): number =>
  match(death)
    .with(number, (seconds) => clamp(seconds / PLAYER_DEATH_SECONDS, 0, 1))
    .otherwise(() => 0);

const isFlashing = (player: Player): boolean =>
  player.timers.hurt > 0 && isAlive(player);

const isStarlit = (player: Player): boolean =>
  player.timers.star > 0 && isAlive(player);

const bodyColors = (player: Player): PlayerColors =>
  match(isFlashing(player))
    .with(true, () => HURT_PLAYER_COLORS)
    .otherwise(() => PLAYER_COLORS);

const invincibleAlpha = (player: Player, time: number): number =>
  match({
    flashing: isFlashing(player),
    blinking: player.timers.invincibility > 0 && isAlive(player),
  })
    .with({ flashing: true }, () => 1)
    .with(
      { blinking: true },
      () => 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(time * 30)),
    )
    .otherwise(() => 1);

const starGlowAlpha = (player: Player, time: number): number =>
  clamp(player.timers.star / STAR_GLOW_FADE_SECONDS, 0, 1) *
  (STAR_GLOW_INNER_ALPHA +
    STAR_GLOW_PULSE_ALPHA *
      (0.5 + 0.5 * Math.sin(time * STAR_GLOW_PULSE_RATE)));

const starGlowStep = (player: Player, time: number): CanvasStep =>
  match(isStarlit(player))
    .with(true, () =>
      sequence([
        save,
        styled({ globalAlpha: starGlowAlpha(player, time) }),
        scale(STAR_GLOW_SQUASH, 1),
        beginPath,
        arc(0, 0, STAR_GLOW_RADIUS, 0, Math.PI * 2),
        styledWith((context) => ({
          fillStyle: radialGradient(context, 0, 0, 0, 0, 0, STAR_GLOW_RADIUS, [
            [0, STAR_GLOW_CORE_COLOR],
            [0.5, STAR_GLOW_COLOR],
            [1, STAR_GLOW_FADE_COLOR],
          ]),
        })),
        fill,
        restore,
      ]),
    )
    .otherwise(() => skip);

export const drawPlayer = (
  context: CanvasRenderingContext2D,
  player: Player,
  time: number,
): void =>
  chain({
    isDying: !isAlive(player),
    colors: bodyColors(player),
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
    .thru(({ isDying, colors, progress, facing, swing }) =>
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
        starGlowStep(player, time),
        rotate(-facing * progress * DEATH_SPIN),
        scale(facing, 1),
        legsStep(player.statuses.isGrounded, swing, colors),
        bodyStep(swing, colors),
        headStep(isDying, colors),
        restore,
      ),
    )
    .value();
