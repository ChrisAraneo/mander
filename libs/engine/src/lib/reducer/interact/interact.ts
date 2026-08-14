import { concat } from 'lodash-es';
import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { levelScore } from '../score/level-score';

const complete = (state: GameState): GameState => ({
  ...state,
  status: 'COMPLETE',
  score: state.score + levelScore(state.time),
  levelTimes: concat(state.levelTimes, state.time),
});

export const interact = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState =>
      match({ isNearChest: state.isNearChest, hasKey: state.hasKey })
        .with({ isNearChest: true, hasKey: true }, (): GameState => ({
          ...state,
          status: 'CHEST',
        }))
        .otherwise(() =>
          match(state.isNearPortal)
            .with(true, (): GameState => complete(state))
            .otherwise((): GameState => state),
        ),
    )
    .otherwise((): GameState => state);
