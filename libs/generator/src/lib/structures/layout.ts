import type { Layers } from '@mander/model';
import type { Sector } from '@mander/structures';
import { match } from 'ts-pattern';

import { isVertical } from './is-vertical';
import { joinStructures } from './join-structures';
import { stackStructures } from './stack-structures';

export interface Layout {
  join: (structures: Sector[]) => Layers;
}

export const ACROSS: Layout = Object.freeze({
  join: joinStructures,
});

export const UPWARD: Layout = Object.freeze({
  join: stackStructures,
});

export const getLayout = (levelNumber: number): Layout =>
  match(isVertical(levelNumber))
    .with(true, () => UPWARD)
    .otherwise(() => ACROSS);
