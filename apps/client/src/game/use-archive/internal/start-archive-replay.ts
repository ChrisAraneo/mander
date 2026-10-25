import { match, P } from 'ts-pattern';
import { initializeCanvas } from '../../canvas';
import { type ReplaySession, startReplay } from '../../use-replay';

const { nonNullable } = P;

export const startArchiveReplay = (session: ReplaySession): ReplaySession =>
  match(initializeCanvas(session.stage.cell))
    .with(nonNullable, () => startReplay(session))
    .otherwise(() => session);
