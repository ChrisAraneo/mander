import type { GemColors } from '../../types/gem-colors';
import type { StarColors } from '../../types/star-colors';

export type ItemArt =
  | { kind: 'HEARTS'; count: number }
  | { kind: 'GEM'; colors: GemColors }
  | { kind: 'STARS'; count: number; colors: StarColors }
  | { kind: 'BULLETS'; count: number }
  | { kind: 'FIREBALLS'; count: number }
  | { kind: 'BOOTS' }
  | { kind: 'HELMET' };
