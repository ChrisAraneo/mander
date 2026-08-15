import type { FireballSpin } from './fireball-spin';

export interface Fireball {
  spin: FireballSpin;
  origin: {
    x: number;
    y: number;
  };
  angle: number;
}
