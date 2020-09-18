import AbstractView from './abstract.js';

const createLoadMessageTemplate = (message) => {
  return (
    `<p class="trip-events__msg">
      ${message}
    </p>`
  );
};

export default class Loading extends AbstractView {
  constructor(message) {
    super();

    this._message = message;
  }
  get template() {
    return createLoadMessageTemplate(this._message);
  }
}
