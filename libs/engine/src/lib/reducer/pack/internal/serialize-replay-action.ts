import { match } from 'ts-pattern';
import type { RecordableAction } from '../../types/recordable-action';
import { getActionCode } from '../get-action-code';

export const serializeReplayAction = (action: RecordableAction): number[] =>
  match(action)
    .with({ type: 'MOVE_LEFT_START' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'MOVE_LEFT_STOP' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'MOVE_RIGHT_START' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'MOVE_RIGHT_STOP' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'JUMP_START' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'JUMP_STOP' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'INTERACT' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'CHOOSE_ITEM' }, ({ index }) => [
      getActionCode('CHOOSE_ITEM'),
      index,
    ])
    .with({ type: 'CLOSE' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'LOAD_LEVEL' }, ({ levelIndex }) => [
      getActionCode('LOAD_LEVEL'),
      levelIndex,
    ])
    .with({ type: 'RESPAWN' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'RESTART' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'USE_STAR' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'SHOOT' }, ({ type }) => [getActionCode(type)])
    .with({ type: 'TOGGLE_MOON_MAGNET' }, ({ type }) => [getActionCode(type)])
    .exhaustive();
