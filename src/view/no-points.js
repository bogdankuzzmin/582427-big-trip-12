import {createElement} from "../utils.js";

const createNoPointstemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <p class="trip-events__msg">Click New Event to create your first point</p>
    </section>`
  );
};

export default class NoPoints {
  constructor() {
    this._element = null;
  }

  get template() {
    return createNoPointstemplate();
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get removeElement() {
    this._element = null;
  }
}
