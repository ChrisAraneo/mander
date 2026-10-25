import type { PackedReplay } from '@mander/engine';
import { match, P } from 'ts-pattern';
import { isPackedReplay } from './is-packed-replay';

const { when } = P;

export const parsePackedReplay = (value: unknown): PackedReplay | null =>
  match(value)
    .with(when(isPackedReplay), (replay) => replay)
    .otherwise(() => null);
