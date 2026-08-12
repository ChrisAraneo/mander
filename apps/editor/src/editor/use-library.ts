import { ref } from 'vue';

import { formatStructure } from './format-structure';
import { fetchLibrary, postStructure } from './library-api';
import type { StructureEntry } from './structure-entry';

const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const useLibrary = () => {
  const entries = ref<StructureEntry[]>([]);
  const status = ref('');
  const isReady = ref(false);

  const load = async (): Promise<void> => {
    try {
      entries.value = await fetchLibrary();
      isReady.value = true;
    } catch (error) {
      isReady.value = false;
      status.value = `The library is out of reach — ${messageOf(error)}`;
    }
  };

  const save = async (name: string, grid: number[][]): Promise<void> => {
    try {
      const saved = await postStructure(name, formatStructure(grid));
      status.value = `${saved.created ? 'Wrote' : 'Updated'} ${saved.name} in ${saved.difficulty}.ts`;
      await load();
    } catch (error) {
      status.value = `Nothing saved — ${messageOf(error)}`;
    }
  };

  return { entries, isReady, load, save, status };
};
