import './styles.css';

import { match, P } from 'ts-pattern';

import { chain, noop } from 'lodash-es';
import { bindPainting } from './editor/mount/bind-painting';
import { createState } from './editor/state/create-state';
import { createApp } from './editor/html/create-app';
import { refreshState } from './editor/state/refresh-state';

const { nullish } = P;

match(document.querySelector<HTMLElement>('#app'))
  .with(nullish, noop)
  .otherwise((app) =>
    chain(createState())
      .tap((state) => bindPainting(state))
      .tap((state) => app.replaceChildren(createApp(state)))
      .thru((state) => refreshState(state))
      .value(),
  );
