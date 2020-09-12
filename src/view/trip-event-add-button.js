import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createTripEventAddButton = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" data-control="${MenuItem.ADD_EVENT}">New event</button>`
  );
};

export default class TripEventAddButton extends AbstractView {
  constructor() {
    super();

    this._addButtonClickHandler = this._addButtonClickHandler.bind(this);
  }

  get template() {
    return createTripEventAddButton();
  }

  _addButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.addButtonClick(evt.target.dataset.control);
  }

  setAddButtonClickHandler(callback) {
    this._callback.addButtonClick = callback;
    this.element.addEventListener(`click`, this._addButtonClickHandler);
  }
}
