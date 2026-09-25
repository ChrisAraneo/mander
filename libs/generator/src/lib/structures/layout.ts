import type { Layers, Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import { match } from 'ts-pattern';

import { addChest } from './add-chest';
import { addGems } from './add-gems';
import { addKey } from './add-key';
import { addVerticalChest } from './add-vertical-chest';
import { addVerticalGems } from './add-vertical-gems';
import { addVerticalKey } from './add-vertical-key';
import { addVerticalPortal } from './add-vertical-portal';
import { addVerticalSpawn } from './add-vertical-spawn';
import { isVertical } from './is-vertical';
import { joinStructures } from './join-structures';
import { placePlayerSpawn } from './player-spawn/place-player-spawn';
import { placePortal } from './portal/place-portal';
import { stackStructures } from './stack-structures';

type Sow = (tiles: Tile[][]) => Tile[][];

export interface Layout {
  join: (structures: Sector[]) => Layers;
  placePlayerSpawn: Sow;
  placePortal: Sow;
  addKey: Sow;
  addChest: Sow;
  addGems: Sow;
}

export const ACROSS: Layout = Object.freeze({
  join: joinStructures,
  placePlayerSpawn,
  placePortal,
  addKey,
  addChest,
  addGems,
});

export const UPWARD: Layout = Object.freeze({
  join: stackStructures,
  placePlayerSpawn: addVerticalSpawn,
  placePortal: addVerticalPortal,
  addKey: addVerticalKey,
  addChest: addVerticalChest,
  addGems: addVerticalGems,
});

export const getLayout = (levelNumber: number): Layout =>
  match(isVertical(levelNumber))
    .with(true, () => UPWARD)
    .otherwise(() => ACROSS);
