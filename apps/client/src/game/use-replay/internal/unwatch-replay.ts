import type { ReplaySession } from '../types/replay-session';

export const unwatchReplay = (session: ReplaySession): void =>
  session.subscription.value?.unsubscribe();
