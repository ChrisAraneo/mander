import { GEM_ENTITY_BOX, type Player } from '@mander/model';
import type { Point } from '@mander/utils';
import { filter } from 'lodash-es';
import { PICKUP_RANGE } from '../consts';
import { isNearTile } from './is-near-tile';

export const filterLeftBehind = (player: Player, gems: Point[]): Point[] =>
  filter(gems, (gem) => !isNearTile(player, gem, GEM_ENTITY_BOX, PICKUP_RANGE));
