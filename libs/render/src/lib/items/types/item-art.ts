import type { ShadeColors } from '../../types/shade-colors';

export type ItemArt =
  | { kind: 'HEARTS'; count: number }
  | { kind: 'GEM'; colors: ShadeColors }
  | { kind: 'STARS'; count: number; colors: ShadeColors }
  | { kind: 'BULLETS'; count: number };
