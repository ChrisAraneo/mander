import { type Enemy, type Player } from '@mander/model';
import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import { createStompBounce } from './create-stomp-bounce';
import { filterStompedEnemies } from './filter-stomped-enemies';
import type { TickBounce } from './types/tick-bounce';

export const patchStompBounce = (
  previousPlayer: Player,
  player: Player,
  enemies: Enemy[],
  isJumpHeld: boolean,
  deltaSeconds: number,
): TickBounce =>
  match(filterStompedEnemies(previousPlayer, player, enemies, deltaSeconds))
    .when(isEmpty, (): TickBounce => ({ player, enemies }))
    .otherwise((victims) =>
      createStompBounce(player, enemies, victims, isJumpHeld),
    );
