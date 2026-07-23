import './styles.css';

import { mountEditor } from './editor';

const APP = document.querySelector<HTMLElement>('#app');
if (APP) mountEditor(APP);
