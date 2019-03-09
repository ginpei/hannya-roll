import './index.css';
import { throttle } from './misc';
import HannyaRoller from './HannyaRoller';
import text from './hannya-text';

const el = document.querySelector('#root');
const roller = new HannyaRoller({ el, text });
roller.start();
window.addEventListener('resize', throttle(() => roller.updateLayout()));
