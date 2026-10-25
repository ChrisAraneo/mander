export const toWrappedHue = (hue: number): number => ((hue % 360) + 360) % 360;
