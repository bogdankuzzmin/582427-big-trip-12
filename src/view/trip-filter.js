import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType, filterStatus) => {
  const {type, name} = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio"
        name="trip-filter"
        value="${type}" ${type === currentFilterType ? `checked` : ``}
        ${filterStatus[type] ? `` : `disabled`}
        >
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>`
  );
};

const createTFilterTemplate = (filterItems, currentFilterType, filterStatus) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType, filterStatus))
    .join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class TripFilter extends AbstractView {
  constructor(filters, currentFilterType, filterStatus) {
    super();

    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterStatus = filterStatus;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }
  get template() {
    return createTFilterTemplate(this._filters, this._currentFilterType, this._filterStatus);
  }

  disableFilters() {
    const allFilters = this.element.querySelectorAll(`.trip-filters__filter-input`);

    allFilters.forEach((filter) => {
      filter.disabled = true;
    });
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
