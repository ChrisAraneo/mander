import { tap } from 'ramda';

import type { CanvasStep } from './canvas-step';
import type { CanvasStyle } from './canvas-style';

export const run = (
  action: (context: CanvasRenderingContext2D) => unknown,
): CanvasStep => tap(action);

export const styled =
  (style: CanvasStyle): CanvasStep =>
  (context) =>
    Object.assign(context, style);

export const styledWith =
  (toStyle: (context: CanvasRenderingContext2D) => CanvasStyle): CanvasStep =>
  (context) =>
    styled(toStyle(context))(context);

export const save: CanvasStep = run((context) => context.save());

export const restore: CanvasStep = run((context) => context.restore());

export const beginPath: CanvasStep = run((context) => context.beginPath());

export const closePath: CanvasStep = run((context) => context.closePath());

export const fill: CanvasStep = run((context) => context.fill());

export const stroke: CanvasStep = run((context) => context.stroke());

export const clip: CanvasStep = run((context) => context.clip());

export const moveTo = (x: number, y: number): CanvasStep =>
  run((context) => context.moveTo(x, y));

export const lineTo = (x: number, y: number): CanvasStep =>
  run((context) => context.lineTo(x, y));

export const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
): CanvasStep => run((context) => context.rect(x, y, width, height));

export const roundRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): CanvasStep =>
  run((context) => context.roundRect(x, y, width, height, radius));

export const fillRect = (
  x: number,
  y: number,
  width: number,
  height: number,
): CanvasStep => run((context) => context.fillRect(x, y, width, height));

export const arc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): CanvasStep =>
  run((context) => context.arc(x, y, radius, startAngle, endAngle));

export const ellipse = (
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
): CanvasStep =>
  run((context) =>
    context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle),
  );

export const translate = (x: number, y: number): CanvasStep =>
  run((context) => context.translate(x, y));

export const rotate = (angle: number): CanvasStep =>
  run((context) => context.rotate(angle));

export const scale = (x: number, y: number): CanvasStep =>
  run((context) => context.scale(x, y));

export const setTransform = (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
): CanvasStep => run((context) => context.setTransform(a, b, c, d, e, f));
