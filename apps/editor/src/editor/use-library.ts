import { ref } from 'vue';
import type { Library } from './types/library';
import type { StructureEntry } from './types/structure-entry';

export const useLibrary = (): Library => ({
  entries: ref<StructureEntry[]>([]),
  status: ref(''),
  isReady: ref(false),
});
