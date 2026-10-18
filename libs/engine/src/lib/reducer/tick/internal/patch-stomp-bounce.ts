import { type Enemy, type Player, chain } from '@mander/model';
import { size } from 'lodash-es';
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
  chain(filterStompedEnemies(previousPlayer, player, enemies, deltaSeconds))
    .thru((victims) =>
      match(size(victims) > 0)
        .with(true, () =>
          createStompBounce(player, enemies, victims, isJumpHeld),
        )
        .otherwise((): TickBounce => ({ player, enemies })),
    )
    .value();
