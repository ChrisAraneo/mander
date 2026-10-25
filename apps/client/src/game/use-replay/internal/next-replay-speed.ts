import { indexOf, size } from 'lodash-es';
import { REPLAY_SPEEDS } from '../consts';

export const nextReplaySpeed = (speed: number): number =>
  REPLAY_SPEEDS[(indexOf(REPLAY_SPEEDS, speed) + 1) % size(REPLAY_SPEEDS)];
