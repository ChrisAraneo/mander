export type CanvasStyle = Partial<
  Pick<
    CanvasRenderingContext2D,
    | 'fillStyle'
    | 'globalAlpha'
    | 'lineJoin'
    | 'lineWidth'
    | 'shadowBlur'
    | 'shadowColor'
    | 'strokeStyle'
  >
>;
