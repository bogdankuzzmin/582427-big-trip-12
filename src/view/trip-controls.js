import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createTripControlsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-control="${MenuItem.EVENTS}">Table</a>
      <a class="trip-tabs__btn" href="#" data-control="${MenuItem.STATS}">Stats</a>
    </nav>`
  );
};

export default class TripControls extends AbstractView {
  constructor() {
    super();
    this._currentControlType = MenuItem.EVENTS;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  get template() {
    return createTripControlsTemplate();
  }

  _deleteAcativeControl() {
    const items = this.element.querySelectorAll(`[data-control]`);

    items.forEach((item) => {
      item.classList.remove(`trip-tabs__btn--active`);
    });
  }

  setMenuItem(menuItem) {
    const item = this.element.querySelector(`[data-control=${menuItem}]`);
    this._deleteAcativeControl();

    if (item !== null) {
      item.classList.add(`trip-tabs__btn--active`);
    }

    if (menuItem === MenuItem.ADD_EVENT) {
      this._currentControlType = MenuItem.EVENTS;
      this.element.querySelector(`[data-control=${MenuItem.EVENTS}]`).classList.add(`trip-tabs__btn--active`);
    }
  }

  _menuClickHandler(evt) {
    const target = evt.target.dataset.control;
    evt.preventDefault();

    if (this._currentControlType === target) {
      return;
    }

    this._currentControlType = target;
    this._callback.menuClick(target);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.element.addEventListener(`click`, this._menuClickHandler);
  }
}
