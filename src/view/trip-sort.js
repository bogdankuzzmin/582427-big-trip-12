import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const createTripSortItemTemplate = () => {
  return Object.values(SortType).map((type) => {
    return (
      `<div class="trip-sort__item  trip-sort__item--${type}">
        <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${type === `event` ? `checked` : ``}>
        <label class="trip-sort__btn" for="sort-${type}" data-sort-type="${type}">${type}</label>
      </div>`
    );
  }).join(``);
};

const createTripSortTemplate = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${createTripSortItemTemplate()}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class TripSort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  get template() {
    return createTripSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.matches(`.trip-sort__btn`)) {
      const tripSortDay = evt.target.parentElement.parentElement.querySelector(`.trip-sort__item--day`);

      if (evt.target.dataset.sortType !== `event`) {
        tripSortDay.textContent = ``;
      } else {
        tripSortDay.textContent = `Day`;
      }

      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
