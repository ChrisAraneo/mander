import type { Triangle } from '@mander/generator';

export function boxHitsTriangle(
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
  triangle: Triangle
): boolean {
  const boxRight = boxLeft + boxWidth;
  const boxBottom = boxTop + boxHeight;

  const triangleLeft = Math.min(triangle[0].x, triangle[1].x, triangle[2].x);
  const triangleRight = Math.max(triangle[0].x, triangle[1].x, triangle[2].x);
  if (triangleRight <= boxLeft || triangleLeft >= boxRight) return false;
  const triangleTop = Math.min(triangle[0].y, triangle[1].y, triangle[2].y);
  const triangleBottom = Math.max(triangle[0].y, triangle[1].y, triangle[2].y);
  if (triangleBottom <= boxTop || triangleTop >= boxBottom) return false;

  const corners = [
    [boxLeft, boxTop],
    [boxRight, boxTop],
    [boxRight, boxBottom],
    [boxLeft, boxBottom],
  ] as const;
  for (let edgeIndex = 0; edgeIndex < 3; edgeIndex++) {
    const start = triangle[edgeIndex];
    const end = triangle[(edgeIndex + 1) % 3];
    const normalX = start.y - end.y;
    const normalY = end.x - start.x;

    let triangleMin = Infinity;
    let triangleMax = -Infinity;
    for (const point of triangle) {
      const projection = point.x * normalX + point.y * normalY;
      if (projection < triangleMin) triangleMin = projection;
      if (projection > triangleMax) triangleMax = projection;
    }
    let boxMin = Infinity;
    let boxMax = -Infinity;
    for (const [cornerX, cornerY] of corners) {
      const projection = cornerX * normalX + cornerY * normalY;
      if (projection < boxMin) boxMin = projection;
      if (projection > boxMax) boxMax = projection;
    }
    if (triangleMax <= boxMin || triangleMin >= boxMax) return false;
  }
  return true;
}
