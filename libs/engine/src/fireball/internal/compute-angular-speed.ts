import type { FireballKind } from '@mander/model';
import { match } from 'ts-pattern';
import { FIREBALL_ANGULAR_SPEED, PINKBALL_ANGULAR_SPEED } from '../consts';

export const computeAngularSpeed = (kind: FireballKind): number =>
  match(kind)
    .with('FIRE', () => FIREBALL_ANGULAR_SPEED)
    .with('ICE', () => FIREBALL_ANGULAR_SPEED)
    .with('PINK', () => PINKBALL_ANGULAR_SPEED)
    .exhaustive(() => FIREBALL_ANGULAR_SPEED);
