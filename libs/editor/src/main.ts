import './styles.css';

import { mountEditor } from './editor';

const app = document.querySelector('#app');
if (app) mountEditor(app);
