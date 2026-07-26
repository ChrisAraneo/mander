import { bindPainting } from './mount/bind-painting';
import { createApp } from './html/create-app';
import { createState } from './state/create-state';
import { refreshState } from './state/refresh-state';

export const mountEditor = (root: HTMLElement): void => {
  const state = createState();

  bindPainting(state);
  root.replaceChildren(createApp(state));
  refreshState(state);
};
