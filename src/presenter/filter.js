import {render, replace, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FilterType, UpdateType, InsertPosition} from "../const.js";

import FilterView from "../view/trip-filter.js";

export default class Filter {
  constructor(filterContainer, filterModel, eventModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventModel = eventModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    const events = this._eventModel.getEvents();

    const filtersStatus = {
      [FilterType.EVERYTHING]: events.length > 0,
      [FilterType.FUTURE]: filter[FilterType.FUTURE](events).length > 0,
      [FilterType.PAST]: filter[FilterType.PAST](events).length > 0,
    };

    this._filterComponent = new FilterView(filters, this._currentFilter, filtersStatus);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, InsertPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  disableFilters() {
    this._filterComponent.disableFilters();
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: `Everything`,
      },
      {
        type: FilterType.FUTURE,
        name: `Future`,
      },
      {
        type: FilterType.PAST,
        name: `Past`,
      },
    ];
  }
}
