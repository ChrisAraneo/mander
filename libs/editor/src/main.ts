import './styles.css';

import { match, P } from 'ts-pattern';

import { chain, noop } from 'lodash-es';
import { bindPainting } from './lib/mount/bind-painting';
import { createState } from './lib/state/create-state';
import { createApp } from './lib/html/create-app';
import { refreshState } from './lib/state/refresh-state';

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
