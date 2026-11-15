import type { Bullet } from '@mander/model';
import { match, P } from 'ts-pattern';
import type { Volley } from '../types/volley';
import { findStruckSpikeTile } from './find-struck-spike-tile';
import { patchShatteredSpikeTile } from './patch-shattered-spike-tile';
import { patchVolleyAfterTileMiss } from './patch-volley-after-tile-miss';

const { nonNullable } = P;

export const patchVolleyAfterMiss = (volley: Volley, bullet: Bullet): Volley =>
  match(findStruckSpikeTile(volley.level, bullet))
    .with(nonNullable, (tile): Volley => ({
      ...volley,
      level: patchShatteredSpikeTile(volley.level, tile),
    }))
    .otherwise(() => patchVolleyAfterTileMiss(volley, bullet));
