import type { FireballKind } from './fireball-kind';
import type { FireballSpin } from './fireball-spin';

export interface Fireball {
  kind: FireballKind;
  spin: FireballSpin;
  origin: {
    x: number;
    y: number;
  };
  angle: number;
}
