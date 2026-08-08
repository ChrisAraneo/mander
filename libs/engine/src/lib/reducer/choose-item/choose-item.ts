import type { Item } from '@mander/model';
import { concat } from 'lodash-es';
import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { capabilitiesFor } from '../player/capabilities-for';
import { withCapabilities } from '../player/with-capabilities';
import { scoreGain } from '../score/score-gain';

const heartGain = (item: Item): number =>
  match(item.effect)
    .with({ kind: 'HEART' }, (effect) => effect.amount)
    .otherwise(() => 0);

const withItem = (state: GameState, item: Item): GameState => {
  const inventory = concat(state.inventory, item);

  return {
    ...state,
    status: 'PLAYING',
    isChestOpened: true,
    isNearChest: false,
    inventory,
    score: state.score + scoreGain(item),
    player: withCapabilities(
      {
        ...state.player,
        hearts: {
          ...state.player.hearts,
          value: state.player.hearts.value + heartGain(item),
        },
      },
      capabilitiesFor(),
    ),
  };
};

export const chooseItem = (state: GameState, index: number): GameState =>
  match(state.status)
    .with('CHEST', (): GameState => {
      const items = state.level.chestItems;
      return match(index >= 0 && index < items.length)
        .with(true, (): GameState => withItem(state, items[index]))
        .otherwise((): GameState => state);
    })
    .otherwise((): GameState => state);
