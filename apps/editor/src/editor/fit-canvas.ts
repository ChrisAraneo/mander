export const fitCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D | null => {
  const ratio = window.devicePixelRatio || 1;

  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext('2d');
  if (context === null) return null;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return context;
};
