import { chain } from '@mander/utils';
import {
  ENEMY_DEATH_SECONDS,
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  isAlive,
} from '@mander/engine';
import type { Enemy, EnemyKind } from '@mander/model';
import { assign, clamp, map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  applyStyle,
  beginPath,
  type CanvasStep,
  closePath,
  fill,
  moveTo,
  paint,
  restore,
  rotate,
  runWhen,
  save,
  scale,
  sequence,
  stroke,
  traceArc,
  traceEllipse,
  traceLineTo,
  traceRect,
  traceRoundRect,
  translate,
} from '../canvas';
import { outline } from '../stroke';

const { number } = P;

const SQUASH_FLOOR = 0.15;

const HALF_WIDTH = ENEMY_WIDTH / 2;
const HALF_HEIGHT = ENEMY_HEIGHT / 2;

interface EnemyPalette {
  feet: string;
  body: string;
  belly: string;
  brow: string;
}

const HOPPING_PALETTE: EnemyPalette = {
  feet: '#2A7D2A',
  body: '#3FB53F',
  belly: '#5FD55F',
  brow: '#123A12',
};

const HORNED_PALETTE: EnemyPalette = {
  feet: '#7D2F2A',
  body: '#B5473F',
  belly: '#D5695F',
  brow: '#3A1512',
};

const FLYING_PALETTE: EnemyPalette = {
  feet: '#1E5FA8',
  body: '#3C8DE0',
  belly: '#7FC3FF',
  brow: '#123A6B',
};

const getPalette = (kind: EnemyKind): EnemyPalette =>
  match(kind)
    .with('HORNED', () => HORNED_PALETTE)
    .with('FLYING', () => FLYING_PALETTE)
    .otherwise(() => HOPPING_PALETTE);

const createBodyStep = (palette: EnemyPalette): CanvasStep =>
  sequence([
    beginPath,
    traceRect(-HALF_WIDTH + 3, HALF_HEIGHT - 4, 5, 3),
    traceRect(HALF_WIDTH - 8, HALF_HEIGHT - 4, 5, 3),
    outline(),
    applyStyle({ fillStyle: palette.feet }),
    fill,
    beginPath,
    traceRoundRect(
      -HALF_WIDTH + 2,
      -HALF_HEIGHT + 2,
      ENEMY_WIDTH - 4,
      ENEMY_HEIGHT - 4,
      6,
    ),
    outline(),
    applyStyle({ fillStyle: palette.body }),
    fill,
    applyStyle({ fillStyle: palette.belly }),
    beginPath,
    traceRoundRect(-HALF_WIDTH + 5, -1, ENEMY_WIDTH - 10, HALF_HEIGHT - 3, 4),
    fill,
  ]);

const HORN_X_POSITIONS = [-5, 0, 5];
const HORN_BASE_Y = -9;
const HORN_TIP_Y = -15;
const HORN_HALF_WIDTH = 2;

const createHornStep = (hornX: number, palette: EnemyPalette): CanvasStep =>
  sequence([
    beginPath,
    moveTo(hornX - HORN_HALF_WIDTH, HORN_BASE_Y),
    traceLineTo(hornX + HORN_HALF_WIDTH, HORN_BASE_Y),
    traceLineTo(hornX, HORN_TIP_Y),
    closePath,
    outline(),
    applyStyle({ fillStyle: palette.feet }),
    fill,
  ]);

const createHornsStep = (palette: EnemyPalette): CanvasStep =>
  sequence(map(HORN_X_POSITIONS, (hornX) => createHornStep(hornX, palette)));

const WING_COLOR = '#FFFFFF';
const WING_FLAP_SPEED = 10;
const WING_FLAP_ANGLE = 0.6;
const WING_SIDES = [-1, 1];

const createWingStep = (side: number, flap: number): CanvasStep =>
  sequence([
    save,
    translate(side * (HALF_WIDTH - 3), -3),
    rotate(side * flap),
    beginPath,
    traceEllipse(side * 7, 0, 8, 3.5, 0, 0, Math.PI * 2),
    outline(),
    applyStyle({ fillStyle: WING_COLOR }),
    fill,
    restore,
  ]);

const createWingsStep = (time: number): CanvasStep =>
  chain(Math.sin(time * WING_FLAP_SPEED) * WING_FLAP_ANGLE)
    .thru((flap) => map(WING_SIDES, (side) => createWingStep(side, flap)))
    .thru(sequence)
    .value();

const drawDeadEyes: CanvasStep = sequence([
  applyStyle({ lineWidth: 1.2 }),
  beginPath,
  moveTo(-6, -6),
  traceLineTo(-1.5, -2),
  moveTo(-1.5, -6),
  traceLineTo(-6, -2),
  moveTo(1, -6),
  traceLineTo(5.5, -2),
  moveTo(5.5, -6),
  traceLineTo(1, -2),
  stroke,
]);

const drawLivingEyes: CanvasStep = sequence([
  beginPath,
  traceArc(-3, -4, 1.4, 0, Math.PI * 2),
  traceArc(4, -4, 1.4, 0, Math.PI * 2),
  fill,
]);

const createEyesStep = (isDying: boolean): CanvasStep =>
  sequence([
    applyStyle({ fillStyle: '#FDF3EA' }),
    beginPath,
    traceArc(-4, -4, 3.2, 0, Math.PI * 2),
    traceArc(3, -4, 3.2, 0, Math.PI * 2),
    fill,
    applyStyle({ strokeStyle: '#1C1C28', fillStyle: '#1C1C28' }),
    match(isDying)
      .with(true, () => drawDeadEyes)
      .otherwise(() => drawLivingEyes),
  ]);

const createBrowsStep = (palette: EnemyPalette): CanvasStep =>
  sequence([
    applyStyle({ strokeStyle: palette.brow, lineWidth: 1.4 }),
    beginPath,
    moveTo(-7, -8),
    traceLineTo(-1, -6),
    moveTo(7, -8),
    traceLineTo(1, -6),
    stroke,
  ]);

const BEARTRAP_STEEL = '#8E9AA6';
const BEARTRAP_SHADOW = '#5A6673';
const BEARTRAP_TOOTH = '#E8EEF4';
const BEARTRAP_SPRING = '#B4603A';

const PLATE_HEIGHT = 6;

const JAW_HINGE_X = HALF_WIDTH - 5;
const JAW_HINGE_Y = HALF_HEIGHT - 5;
const JAW_LENGTH = 15;
const JAW_THICKNESS = 3.5;
const JAW_OPEN_TILT = 0.65;
const JAW_SHUT_TILT = 0.12;

const TOOTH_LENGTH = 3.5;
const TOOTH_HALF_HEIGHT = 1.6;
const TOOTH_Y_POSITIONS = [-4.5, -8.5, -12.5];

const SPRING_SIDES = [-1, 1];

const createToothStep = (toothY: number): CanvasStep =>
  sequence([
    moveTo(JAW_THICKNESS / 2, toothY - TOOTH_HALF_HEIGHT),
    traceLineTo(JAW_THICKNESS / 2 + TOOTH_LENGTH, toothY),
    traceLineTo(JAW_THICKNESS / 2, toothY + TOOTH_HALF_HEIGHT),
    closePath,
  ]);

const drawTeeth: CanvasStep = sequence([
  beginPath,
  sequence(map(TOOTH_Y_POSITIONS, createToothStep)),
  outline(),
  applyStyle({ fillStyle: BEARTRAP_TOOTH }),
  fill,
]);

const createJawStep = (tilt: number): CanvasStep =>
  sequence([
    save,
    translate(-JAW_HINGE_X, JAW_HINGE_Y),
    rotate(tilt),
    beginPath,
    traceRoundRect(
      -JAW_THICKNESS / 2,
      -JAW_LENGTH,
      JAW_THICKNESS,
      JAW_LENGTH,
      1.6,
    ),
    outline(),
    applyStyle({ fillStyle: BEARTRAP_STEEL }),
    fill,
    drawTeeth,
    restore,
  ]);

const createJawsStep = (tilt: number): CanvasStep =>
  sequence([
    createJawStep(tilt),
    save,
    scale(-1, 1),
    createJawStep(tilt),
    restore,
  ]);

const drawPlate: CanvasStep = sequence([
  beginPath,
  traceRoundRect(
    -HALF_WIDTH + 1,
    HALF_HEIGHT - PLATE_HEIGHT,
    ENEMY_WIDTH - 2,
    PLATE_HEIGHT,
    2,
  ),
  outline(),
  applyStyle({ fillStyle: BEARTRAP_SHADOW }),
  fill,
  applyStyle({ fillStyle: BEARTRAP_STEEL }),
  beginPath,
  traceRoundRect(
    -HALF_WIDTH + 3,
    HALF_HEIGHT - PLATE_HEIGHT + 1.5,
    ENEMY_WIDTH - 6,
    2,
    1,
  ),
  fill,
]);

const drawPan: CanvasStep = sequence([
  beginPath,
  traceRoundRect(-5, HALF_HEIGHT - PLATE_HEIGHT - 3, 10, 3, 1),
  outline(),
  applyStyle({ fillStyle: BEARTRAP_TOOTH }),
  fill,
]);

const createSpringStep = (side: number): CanvasStep =>
  sequence([
    beginPath,
    traceArc(side * JAW_HINGE_X, JAW_HINGE_Y, 2.6, 0, Math.PI * 2),
    outline(),
    applyStyle({ fillStyle: BEARTRAP_SPRING }),
    fill,
  ]);

const drawSprings: CanvasStep = sequence(map(SPRING_SIDES, createSpringStep));

const getJawTilt = (isSnapped: boolean): number =>
  match(isSnapped)
    .with(true, () => JAW_SHUT_TILT)
    .otherwise(() => -JAW_OPEN_TILT);

const createBeartrapStep = (isSnapped: boolean): CanvasStep =>
  sequence([
    drawPlate,
    drawPan,
    createJawsStep(getJawTilt(isSnapped)),
    drawSprings,
  ]);

const createCreatureStep = (
  enemy: Enemy,
  palette: EnemyPalette,
  isDying: boolean,
  time: number,
): CanvasStep =>
  sequence([
    runWhen(enemy.kind === 'FLYING', createWingsStep(time)),
    createBodyStep(palette),
    runWhen(enemy.kind === 'HORNED', createHornsStep(palette)),
    createEyesStep(isDying),
    createBrowsStep(palette),
  ]);

const createFigureStep = (
  enemy: Enemy,
  palette: EnemyPalette,
  isDying: boolean,
  time: number,
): CanvasStep =>
  match(enemy.kind)
    .with('BEARTRAP', () =>
      createBeartrapStep(!enemy.statuses.isGrounded || isDying),
    )
    .otherwise(() => createCreatureStep(enemy, palette, isDying, time));

const getDeathProgress = (death: Enemy['timers']['death']): number =>
  match(death)
    .with(number, (seconds) => clamp(seconds / ENEMY_DEATH_SECONDS, 0, 1))
    .otherwise(() => 0);

export const drawEnemy = (
  context: CanvasRenderingContext2D,
  enemy: Enemy,
  time: number,
): void =>
  chain({
    isDying: !isAlive(enemy),
    progress: getDeathProgress(enemy.timers.death),
    palette: getPalette(enemy.kind),
  })
    .thru((stage) =>
      assign({}, stage, {
        squash: 1 - stage.progress * (1 - SQUASH_FLOOR),
        facing: match(enemy.statuses.isFacingRight)
          .with(true, () => 1)
          .otherwise(() => -1),
        wobble: match(
          enemy.statuses.isGrounded &&
            !stage.isDying &&
            enemy.kind !== 'BEARTRAP',
        )
          .with(true, () => Math.sin(time * 9 + enemy.spawn.x * 0.2) * 1.2)
          .otherwise(() => 0),
      }),
    )
    .thru(({ isDying, progress, palette, squash, facing, wobble }) =>
      paint(
        context,
        save,
        translate(
          enemy.position.x + HALF_WIDTH,
          enemy.position.y + HALF_HEIGHT + wobble + HALF_HEIGHT * (1 - squash),
        ),
        applyStyle({ globalAlpha: 1 - progress * progress }),
        scale(facing * (1 + progress * 0.35), squash),
        createFigureStep(enemy, palette, isDying, time),
        restore,
      ),
    )
    .value();
