import type { Bullet } from '@mander/model';
import { match, P } from 'ts-pattern';
import type { Volley } from '../types/volley';
import { addVolleyBullet } from './add-volley-bullet';
import { findStruckFallingSpike } from './find-struck-falling-spike';
import { removeVolleyFallingSpike } from './remove-volley-falling-spike';

const { nonNullable } = P;

export const patchVolleyAfterTileMiss = (
  volley: Volley,
  bullet: Bullet,
): Volley =>
  match(findStruckFallingSpike(bullet, volley.fallingSpikes))
    .with(nonNullable, (target) => removeVolleyFallingSpike(volley, target))
    .otherwise(() => addVolleyBullet(volley, bullet));
