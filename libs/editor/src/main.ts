import './styles.css';
import { mountEditor } from './editor';

const app = document.getElementById('app');
if (app) mountEditor(app);
