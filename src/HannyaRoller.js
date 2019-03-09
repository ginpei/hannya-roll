// @ts-check

import './HannyaRoller.css';

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

  updateLayout () {
    const { length } = this._text;
    const screenWidth = this._el.clientWidth;
    const screenHeight = this._el.clientHeight;
    const {
      fontSize,
      nLettersInLine,
      nLines,
      surfaceHeight,
    } = this._findBestLayout(length, screenWidth, screenHeight);

    this.elRoller.style.setProperty('--surface-height', `${surfaceHeight}px`);
    this.elRoller.style.setProperty('--font-size', `${fontSize}px`);
    this.elRoller.style.setProperty('--letters-in-line', `${nLettersInLine}`);
    this.elRoller.innerHTML = '';

    // faster than for()
    const elLineList = new Array(nLines).fill(0)
      .map((_, index) => {
        const progress = index / nLines;
        const degree = -360 * progress;

        const elLine = document.createElement('div');
        elLine.classList.add('HannyaRoller-line');
        elLine.style.setProperty('--degree', `${degree}deg`);
        this.elRoller.appendChild(elLine);

        return elLine;
      });

    this.elLetterList.forEach((elLetter, index) => {
      const lineIndex = Math.floor(index / nLettersInLine);
      const elLine = elLineList[lineIndex];
      elLine.appendChild(elLetter);
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
      const nLines = Math.ceil(length / nLettersInLine);
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

  _startAnimation () {
    const rpm = 2; // rotation per minute
    const startDegree = 0;

    const startedAt = Date.now();
    const cycle = 1000 * 60 / rpm;
    const update = () => {
      const progress = ((Date.now() - startedAt) % cycle) / cycle;

      const degree = (startDegree + progress * 360) % 360;
      this.elSpace.style.setProperty('--space-rotate-y', `${degree}deg`);

      requestAnimationFrame(update);
    };
    update();
  }

  destroy () {
    this._el.removeChild(this.elSpace);
  }
}
