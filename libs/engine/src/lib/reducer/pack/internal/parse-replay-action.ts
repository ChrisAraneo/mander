import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { GameLevel } from '../../../types/game-level';
import type { RecordableAction } from '../../types/recordable-action';
import { ACTION_CODES } from '../action-codes';
import type { PackedEntry } from '../types/packed-entry';
import { tryParseLoadLevelAction } from './try-parse-load-level-action';
import { tryParseRestartAction } from './try-parse-restart-action';

const { nullish } = P;

export const parseReplayAction = (
  entry: PackedEntry,
  levels: GameLevel[],
): RecordableAction | undefined =>
  match(ACTION_CODES[entry[1]])
    .with('MOVE_LEFT_START', (type): RecordableAction => ({ type }))
    .with('MOVE_LEFT_STOP', (type): RecordableAction => ({ type }))
    .with('MOVE_RIGHT_START', (type): RecordableAction => ({ type }))
    .with('MOVE_RIGHT_STOP', (type): RecordableAction => ({ type }))
    .with('JUMP_START', (type): RecordableAction => ({ type }))
    .with('JUMP_STOP', (type): RecordableAction => ({ type }))
    .with('INTERACT', (type): RecordableAction => ({ type }))
    .with('CHOOSE_ITEM', (): RecordableAction => ({
      type: 'CHOOSE_ITEM',
      index: entry[2],
    }))
    .with('CLOSE', (type): RecordableAction => ({ type }))
    .with('LOAD_LEVEL', () => tryParseLoadLevelAction(entry, levels))
    .with('RESPAWN', (type): RecordableAction => ({ type }))
    .with('RESTART', () => tryParseRestartAction(levels))
    .with('USE_STAR', (type): RecordableAction => ({ type }))
    .with('SHOOT', (type): RecordableAction => ({ type }))
    .with('TOGGLE_MOON_MAGNET', (type): RecordableAction => ({ type }))
    .with(nullish, constant(undefined))
    .exhaustive(constant(undefined));
