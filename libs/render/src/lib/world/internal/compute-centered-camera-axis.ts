export const computeCenteredCameraAxis = (
  viewSize: number,
  worldSize: number,
): number => (worldSize - viewSize) / 2;
