import { match } from 'ts-pattern';
import type { RecordableAction } from '../../state/types/recordable-action';
import { findActionCode } from '../find-action-code';

export const serializeReplayAction = (action: RecordableAction): number[] =>
  match(action)
    .with({ type: 'MOVE_LEFT_START' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'MOVE_LEFT_STOP' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'MOVE_RIGHT_START' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'MOVE_RIGHT_STOP' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'JUMP_START' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'JUMP_STOP' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'INTERACT' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'CHOOSE_ITEM' }, ({ index }) => [
      findActionCode('CHOOSE_ITEM'),
      index,
    ])
    .with({ type: 'CLOSE' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'LOAD_LEVEL' }, ({ levelIndex }) => [
      findActionCode('LOAD_LEVEL'),
      levelIndex,
    ])
    .with({ type: 'RESPAWN' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'RESTART' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'USE_STAR' }, ({ type }) => [findActionCode(type)])
    .with({ type: 'SHOOT' }, ({ type }) => [findActionCode(type)])
    .exhaustive();
