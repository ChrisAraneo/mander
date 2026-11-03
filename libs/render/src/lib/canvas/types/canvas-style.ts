export type CanvasStyle = Partial<
  Pick<
    CanvasRenderingContext2D,
    | 'fillStyle'
    | 'globalAlpha'
    | 'globalCompositeOperation'
    | 'imageSmoothingEnabled'
    | 'lineJoin'
    | 'lineWidth'
    | 'strokeStyle'
  >
>;
