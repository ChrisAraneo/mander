import './styles.css';

import { match, P } from 'ts-pattern';

import { mountEditor } from './editor';
import { noop } from 'lodash-es';

const { nullish } = P;

match(document.querySelector<HTMLElement>('#app'))
  .with(nullish, noop)
  .otherwise((app) => mountEditor(app));
