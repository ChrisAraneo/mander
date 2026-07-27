import { match, P } from 'ts-pattern';

import type { State } from '../types/state';
import { loadGrid } from './load-grid';
import { parseGrid } from '../parser/parse-grid';
import { showToast } from './show-toast';

export const loadFromText = (state: State): void =>
  match(parseGrid(state.loader.value))
    .with(P.nullish, () =>
      showToast(
        state.toast,
        "Couldn't read that — expected a grid of 0s and 1s.",
      ),
    )
    .otherwise((parsed) => {
      loadGrid(state, parsed);
      state.loader.value = '';
    });
