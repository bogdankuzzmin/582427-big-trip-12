import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const createTripSortItemTemplate = (currentSortType) => {
  return Object.values(SortType).map((type) => {
    return (
      `<div class="trip-sort__item  trip-sort__item--${type}">
        <input class="trip-sort__input  visually-hidden"
          id="sort-${type}"
          type="radio"
          name="trip-sort"
          value="sort-${type}" ${currentSortType === type ? `checked` : ``}>

        <label class="trip-sort__btn" for="sort-${type}" data-sort-type="${type}">${type}</label>
      </div>`
    );
  }).join(``);
};

const createTripSortTemplate = (currentSortType) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">${currentSortType === SortType.EVENT ? `Day` : ``}</span>
      ${createTripSortItemTemplate(currentSortType)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class TripSort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  get template() {
    return createTripSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.matches(`.trip-sort__btn`)) {
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
