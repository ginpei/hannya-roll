import './HannyaRoller.css';

export default class HannyaRoller {
  /**
   * @param {{ el: Element, text: string }} options
   */
  constructor ({ el, text }) {
    this._el = el;
    this._text = text;
    this._nLines = 40;
  }

  start () {
    this._buildElements();
  }

  _buildElements () {
    this.elSpace = document.createElement('div');
    this.elSpace.classList.add('HannyaRoller-space');

    const elRoller = document.createElement('div');
    elRoller.classList.add('HannyaRoller-roller');
    this.elSpace.appendChild(elRoller);

    const elLineList = new Array(this._nLines).fill(0)
      .map((_, index, { length }) => {
        const progress = index / length;
        const degree = -360 * progress;

        const elLine = document.createElement('div');
        elLine.classList.add('HannyaRoller-line');
        elLine.setAttribute('style', `--degree: ${degree}deg`);
        elRoller.appendChild(elLine);

        return elLine;
      });

    const nLettersInLine = Math.ceil(this._text.length / this._nLines);
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

  destroy () {
    this._el.removeChild(this.elSpace);
    this.elSpace = null;
  }
}
