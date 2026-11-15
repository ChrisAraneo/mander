import { concat } from 'lodash-es';
import { computeLevelScore } from '../../score/compute-level-score';
import type { GameState } from '../../state/types/game-state';

export const finishLevel = (state: GameState): GameState => ({
  ...state,
  status: 'COMPLETE',
  score: state.score + computeLevelScore(state.time),
  levelTimes: concat(state.levelTimes, state.time),
});
