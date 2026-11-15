import { isIce, type Level, type Player } from '@mander/model';
import { some } from 'lodash-es';
import { computeTileRange } from '../../collision/compute-tile-range';
import { PLAYER_WIDTH } from '../consts';
import { computePlayerFootRow } from './compute-player-foot-row';

export const isStandingOnIce = (level: Level, player: Player): boolean =>
  some(computeTileRange(player.position.x, PLAYER_WIDTH), (column) =>
    isIce(level, column, computePlayerFootRow(player)),
  );
