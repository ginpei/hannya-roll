// @ts-check

import './HannyaRoller.css';

export default class HannyaRoller {
  /**
   * @param {IHannyaRollerProps} options
   */
  constructor ({ el, text }) {
    this._el = el;
    this._text = text;
  }

  start () {
    const screenWidth = this._el.clientWidth;
    const screenHeight = this._el.clientHeight;
    this._buildElements(screenWidth, screenHeight);
  }

  /**
   * @param {number} screenWidth
   * @param {number} screenHeight
   */
  _buildElements (screenWidth, screenHeight) {
    const { length } = this._text;
    const {
      fontSize,
      nLettersInLine,
      nLines,
      surfaceHeight,
    } = this._findBestLayout(length, screenWidth, screenHeight);

    this.elSpace = document.createElement('div');
    this.elSpace.classList.add('HannyaRoller-space');

    const elRoller = document.createElement('div');
    elRoller.classList.add('HannyaRoller-roller');
    elRoller.style.setProperty('--surface-height', `${surfaceHeight}px`);
    elRoller.style.setProperty('--font-size', `${fontSize}px`);
    elRoller.style.setProperty('--letters-in-line', `${nLettersInLine}`);
    this.elSpace.appendChild(elRoller);

    const elLineList = new Array(nLines).fill(0)
      .map((_, index) => {
        const progress = index / nLines;
        const degree = -360 * progress;

        const elLine = document.createElement('div');
        elLine.classList.add('HannyaRoller-line');
        elLine.style.setProperty('--degree', `${degree}deg`);
        elRoller.appendChild(elLine);

        return elLine;
      });

    [...this._text].forEach((letter, index) => {
      const elLetter = document.createElement('div');
      elLetter.classList.add('HannyaRoller-letter');
      elLetter.textContent = letter;

      const lineIndex = Math.floor(index / nLettersInLine);
      const elLine = elLineList[lineIndex];
      elLine.appendChild(elLetter);
    });

    this._el.appendChild(this.elSpace);
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

  destroy () {
    this._el.removeChild(this.elSpace);
    this.elSpace = null;
  }
}
