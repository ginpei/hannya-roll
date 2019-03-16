import HannyaRoller from './HannyaRoller';
import text from './hannya-text';

describe('HannyaRoller', () => {
  /** @type HannyaRoller */
  let roller;

  /** @type HTMLDivElement */
  let el;

  beforeEach(() => {
    el = window.document.createElement('div');
    Object.defineProperty(el, 'clientWidth', { value: 800 });
    Object.defineProperty(el, 'clientHeight', { value: 600 });
    roller = new HannyaRoller({ el, text });

    roller.start();
  });

  it('sets up under the specified element', () => {
    /** @type Element */
    const elSpace = el.firstElementChild;
    expect(elSpace.classList.contains('HannyaRoller-space')).toBeTruthy();
  });
});
