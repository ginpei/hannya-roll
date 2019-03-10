// @ts-check

import './HannyaRoller.css';
import { animate } from './misc';

export default class HannyaRoller {
  /**
   * @param {IHannyaRollerProps} options
   */
  constructor ({ el, text }) {
    this._el = el;
    this._text = text;

    this._buildElements();
  }

  start () {
    this._el.appendChild(this.elSpace);
    this.updateLayout();
    this._startAnimation();
  }

  updateLayout () {
    const { length } = this._text;
    const screenWidth = this._el.clientWidth;
    const screenHeight = this._el.clientHeight;
    const layout = this._findBestLayout(length, screenWidth, screenHeight);
    this._render(layout);
  }

  destroy () {
    this._el.removeChild(this.elSpace);
    this.destroyAnimation();
  }

  _buildElements () {
    this.elSpace = document.createElement('div');
    this.elSpace.classList.add('HannyaRoller-space');

    this.elRoller = document.createElement('div');
    this.elRoller.classList.add('HannyaRoller-roller');
    this.elSpace.appendChild(this.elRoller);

    this.elLetterList = [...this._text].map((letter) => {
      const elLetter = document.createElement('div');
      elLetter.classList.add('HannyaRoller-letter');
      elLetter.textContent = letter;
      return elLetter;
    });
  }

  /**
   * @param {number} length
   * @param {number} screenWidth
   * @param {number} screenHeight
   * @returns {IRollerLayout}
   */
  _findBestLayout (length, screenWidth, screenHeight) {
    const surfaceWidth = screenWidth * Math.PI;
    const surfaceHeight = screenHeight * 0.55;

    const layout = {
      fontSize: 10,
      nLettersInLine: 0,
      nLines: 0,
      surfaceHeight,
    };
    for (let fontSize = screenWidth; fontSize > 0; fontSize -= 1) {
      const nLettersInLine = Math.floor(surfaceHeight / fontSize);
      const nLines = Math.ceil(length / nLettersInLine) + 1;
      const width = nLines * fontSize;
      if (width < (surfaceWidth / 2)) {
        layout.fontSize = fontSize;
        layout.nLettersInLine = nLettersInLine;
        layout.nLines = nLines;
        break;
      }
    }
    return layout;
  }

  /**
   * @param {IRollerLayout} layout
   */
  _render ({
    fontSize,
    nLettersInLine,
    nLines,
    surfaceHeight,
  }) {
    this.elRoller.style.setProperty('--surface-height', `${surfaceHeight}px`);
    this.elRoller.style.setProperty('--font-size', `${fontSize}px`);
    this.elRoller.style.setProperty('--letters-in-line', `${nLettersInLine}`);
    this.elRoller.style.setProperty('--lines', `${nLines}`);
    this.elRoller.innerHTML = '';

    // faster than for()
    const elLineList = new Array(nLines).fill(0)
      .map((_, index) => {
        const elLine = document.createElement('div');
        elLine.classList.add('HannyaRoller-line');
        elLine.style.setProperty('--line-index', `${index}`);
        this.elRoller.appendChild(elLine);

        return elLine;
      });

    this.elLetterList.forEach((elLetter, index) => {
      const lineIndex = Math.floor(index / nLettersInLine);
      const elLine = elLineList[lineIndex];
      elLine.appendChild(elLetter);
    });
  }

  _startAnimation () {
    const rpm = 2; // revolutions per minute
    const initialAnimationDuration = 3000; // from CSS
    const progressOffset = -(initialAnimationDuration / (60000 / rpm));

    const startedAt = Date.now();
    const cycle = 1000 * 60 / rpm;

    this.destroyAnimation = animate(60, () => {
      const timeProgress = ((Date.now() - startedAt) % cycle) / cycle;
      const sum = progressOffset + timeProgress;
      const progress = (sum) - Math.floor(sum);
      this.elSpace.style.setProperty('--rotation-progress', `${progress}`);
    });
  }
}
