import type { Fireball } from '@mander/model';
import { match } from 'ts-pattern';
import { computePinkballOrbit } from './compute-pinkball-orbit';
import { createFireballOrbit } from './create-fireball-orbit';
import type { FireballOrbit } from './types/fireball-orbit';

export const computeFireballOrbit = (fireball: Fireball): FireballOrbit =>
  match(fireball.kind)
    .with('FIRE', () => createFireballOrbit(fireball.angle))
    .with('ICE', () => createFireballOrbit(fireball.angle))
    .with('PINK', () => computePinkballOrbit(fireball.angle))
    .exhaustive(() => createFireballOrbit(fireball.angle));
