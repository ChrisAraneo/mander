export const wrapHue = (hue: number): number => ((hue % 360) + 360) % 360;
