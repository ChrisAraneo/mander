import type { Layers, Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import { match } from 'ts-pattern';

import { addChest } from './add-chest';
import { addGems } from './add-gems';
import { addVerticalChest } from './add-vertical-chest';
import { addVerticalGems } from './add-vertical-gems';
import { isVertical } from './is-vertical';
import { joinStructures } from './join-structures';
import { stackStructures } from './stack-structures';

type Sow = (tiles: Tile[][]) => Tile[][];

export interface Layout {
  join: (structures: Sector[]) => Layers;
  addChest: Sow;
  addGems: Sow;
}

export const ACROSS: Layout = Object.freeze({
  join: joinStructures,
  addChest,
  addGems,
});

export const UPWARD: Layout = Object.freeze({
  join: stackStructures,
  addChest: addVerticalChest,
  addGems: addVerticalGems,
});

export const getLayout = (levelNumber: number): Layout =>
  match(isVertical(levelNumber))
    .with(true, () => UPWARD)
    .otherwise(() => ACROSS);
