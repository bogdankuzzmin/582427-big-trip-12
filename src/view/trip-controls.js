import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createTripControlsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-control="${MenuItem.EVENTS}">Table</a>
      <a class="trip-tabs__btn" href="#" data-control="${MenuItem.STATS}">Stats</a>
    </nav>`
  );
};

export default class TripControls extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  get template() {
    return createTripControlsTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.control);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.element.addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.element.querySelector(`[data-control=${menuItem}]`);

    if (item !== null) {
      // item.checked = true;
      // console.log(`ACTIVE ITEM`);
    }
  }
}
