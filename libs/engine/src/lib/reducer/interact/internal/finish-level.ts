import { concat } from 'lodash-es';
import type { GameState } from '../../../types/game-state';
import { computeLevelScore } from '../../score/compute-level-score';

export const finishLevel = (state: GameState): GameState => ({
  ...state,
  status: 'COMPLETE',
  score: state.score + computeLevelScore(state.time),
  levelTimes: concat(state.levelTimes, state.time),
});
