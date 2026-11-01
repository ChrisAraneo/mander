import type { FireballKind } from '@mander/model';
import { match } from 'ts-pattern';
import { FIREBALL_ANGULAR_SPEED, PINKBALL_ANGULAR_SPEED } from '../consts';

export const computeAngularSpeed = (kind: FireballKind): number =>
  match(kind)
    .with('PINK', () => PINKBALL_ANGULAR_SPEED)
    .otherwise(() => FIREBALL_ANGULAR_SPEED);
