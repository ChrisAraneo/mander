import type { PackedReplay } from '@mander/engine';

export interface ArchiveSource {
  id: string;
  day: string;
  replay: PackedReplay;
}
