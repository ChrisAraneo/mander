import { chain } from '@mander/utils';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { ref } from 'vue';

import { formatStructure } from './format-structure';
import { fetchLibrary, postStructure } from './library-api';
import { setRef } from './set-ref';
import type { StructureEntry } from './structure-entry';

const { instanceOf } = P;

const messageOf = (error: unknown): string =>
  match(error)
    .with(instanceOf(Error), (thrown) => thrown.message)
    .otherwise((thrown) => String(thrown));

export const useLibrary = () =>
  chain({
    entries: ref<StructureEntry[]>([]),
    status: ref(''),
    isReady: ref(false),
  })
    .thru((state) => ({
      ...state,
      load: (): Promise<void> =>
        fetchLibrary()
          .then(
            (loaded) =>
              chain(setRef(state.entries, loaded))
                .thru(() => setRef(state.isReady, true))
                .value(),
            (error: unknown) =>
              chain(setRef(state.isReady, false))
                .thru(() =>
                  setRef(
                    state.status,
                    `The library is out of reach — ${messageOf(error)}`,
                  ),
                )
                .value(),
          )
          .then(noop),
    }))
    .thru((state) => ({
      entries: state.entries,
      isReady: state.isReady,
      status: state.status,
      load: state.load,
      save: (name: string, grid: number[][]): Promise<void> =>
        postStructure(name, formatStructure(grid))
          .then(
            (saved) =>
              chain(
                match(saved.created)
                  .with(true, () => 'Wrote')
                  .otherwise(() => 'Updated'),
              )
                .thru((verb) =>
                  setRef(
                    state.status,
                    `${verb} ${saved.name} in ${saved.pool}.ts`,
                  ),
                )
                .thru(() => state.load())
                .value(),
            (error: unknown) =>
              setRef(state.status, `Nothing saved — ${messageOf(error)}`),
          )
          .then(noop),
    }))
    .value();
