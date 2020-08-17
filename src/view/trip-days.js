import {createElement} from "../utils";

const createTripDaysTemplate = () => {

  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class TripDays {
  constructor() {
    this._element = null;
  }

  get template() {
    return createTripDaysTemplate();
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
