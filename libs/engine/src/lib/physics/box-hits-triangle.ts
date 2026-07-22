import type { Triangle } from '@mander/generator';
import { chain, every, map, range } from 'lodash-es';

interface Vec {
  x: number;
  y: number;
}

interface Axis {
  nx: number;
  ny: number;
}

interface Span {
  min: number;
  max: number;
}

const AABB_AXES: Axis[] = [
  { nx: 1, ny: 0 },
  { nx: 0, ny: 1 },
];

const project = (axis: Axis, points: readonly Vec[]): Span =>
  chain(points)
    .map((point) => point.x * axis.nx + point.y * axis.ny)
    .thru((values) => ({ min: Math.min(...values), max: Math.max(...values) }))
    .value();

const separated = (a: Span, b: Span): boolean =>
  a.max <= b.min || a.min >= b.max;

const overlapsOn = (
  axis: Axis,
  triangle: Triangle,
  corners: readonly Vec[],
): boolean => !separated(project(axis, triangle), project(axis, corners));

const edgeAxes = (triangle: Triangle): Axis[] =>
  map(range(3), (edge) => ({
    nx: triangle[edge].y - triangle[(edge + 1) % 3].y,
    ny: triangle[(edge + 1) % 3].x - triangle[edge].x,
  }));

const candidateAxes = (triangle: Triangle): Axis[] => [
  ...AABB_AXES,
  ...edgeAxes(triangle),
];

const boxCorners = (
  left: number,
  top: number,
  width: number,
  height: number,
): Vec[] => [
  { x: left, y: top },
  { x: left + width, y: top },
  { x: left + width, y: top + height },
  { x: left, y: top + height },
];

export const boxHitsTriangle = (
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
  triangle: Triangle,
): boolean =>
  chain(boxCorners(boxLeft, boxTop, boxWidth, boxHeight))
    .thru((corners) =>
      every(candidateAxes(triangle), (axis) =>
        overlapsOn(axis, triangle, corners),
      ),
    )
    .value();
