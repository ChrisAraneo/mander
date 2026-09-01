import type { Tile } from '@mander/model';
import type { Structure } from '@mander/structures';
import { match } from 'ts-pattern';

import { addChest } from './add-chest';
import { addGems } from './add-gems';
import { addKey } from './add-key';
import { addPlayerSpawn } from './add-player-spawn';
import { addPortal } from './add-portal';
import { addVerticalChest } from './add-vertical-chest';
import { addVerticalGems } from './add-vertical-gems';
import { addVerticalKey } from './add-vertical-key';
import { addVerticalPortal } from './add-vertical-portal';
import { addVerticalSpawn } from './add-vertical-spawn';
import { isVertical } from './is-vertical';
import { joinStructures } from './join-structures';
import { stackStructures } from './stack-structures';

type Sow = (tiles: Tile[][]) => Tile[][];

export interface Layout {
  join: (structures: Structure[]) => Tile[][];
  addSpawn: Sow;
  addPortal: Sow;
  addKey: Sow;
  addChest: Sow;
  addGems: Sow;
}

export const ACROSS: Layout = Object.freeze({
  join: joinStructures,
  addSpawn: addPlayerSpawn,
  addPortal,
  addKey,
  addChest,
  addGems,
});

export const UPWARD: Layout = Object.freeze({
  join: stackStructures,
  addSpawn: addVerticalSpawn,
  addPortal: addVerticalPortal,
  addKey: addVerticalKey,
  addChest: addVerticalChest,
  addGems: addVerticalGems,
});

export const layoutFor = (levelNumber: number): Layout =>
  match(isVertical(levelNumber))
    .with(true, () => UPWARD)
    .otherwise(() => ACROSS);
