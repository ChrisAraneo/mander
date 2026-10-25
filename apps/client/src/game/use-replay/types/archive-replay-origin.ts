import type { Replay } from '@mander/engine';

export interface ArchiveReplayOrigin {
  kind: 'ARCHIVE';
  recording: Replay;
}
