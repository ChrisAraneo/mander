import type { PackedReplay } from '@mander/engine';

export interface ArchiveSource {
  day: string;
  replay: PackedReplay;
}
