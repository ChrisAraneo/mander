import type { Action } from './action';

export type RecordableAction = Exclude<Action, { type: 'TICK' }>;
