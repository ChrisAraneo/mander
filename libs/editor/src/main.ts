import './styles.css';

import { match, P } from 'ts-pattern';

import { mountEditor } from './editor';

const { nullish } = P;

match(document.querySelector<HTMLElement>('#app'))
  .with(nullish, () => undefined)
  .otherwise((app) => mountEditor(app));
