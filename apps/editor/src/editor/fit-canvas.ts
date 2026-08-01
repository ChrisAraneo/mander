/**
 * Points the canvas at the device pixels it actually covers, so tile textures
 * stay sharp on a high-DPI screen instead of being scaled up after the fact.
 * The returned context is pre-scaled, so callers keep drawing in CSS pixels.
 */
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
