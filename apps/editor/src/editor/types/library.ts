import type { Ref } from 'vue';
import type { StructureEntry } from './structure-entry';

export interface Library {
  entries: Ref<StructureEntry[]>;
  status: Ref<string>;
  isReady: Ref<boolean>;
}
