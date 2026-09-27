export type CanvasStyle = Partial<
  Pick<
    CanvasRenderingContext2D,
    'fillStyle' | 'globalAlpha' | 'lineJoin' | 'lineWidth' | 'strokeStyle'
  >
>;
