import moment from "moment";
import {render, replace} from "../utils/render.js";
import {separateEventsIntoDays} from "../utils/event.js";
import {InsertPosition, SortType} from "../const.js";

import TripEventPresenter from "./trip-event.js"

import TripEventListView from "../view/trip-event-list.js";
import TripEventDaysView from "../view/trip-event-days.js";
import TripNoEventsView from "../view/trip-no-events.js";
import TripSortView from "../view/trip-sort.js";

import {sortTypeTime, sortTypePrice} from "../utils/sort.js";

export default class Trip {
  constructor(tripEventContainer) {
    this._tripEventContainer = tripEventContainer;
    this._currentSortType = SortType.EVENT;

    this._tripSortComponent = new TripSortView();
    this._tripEventDaysComponent = new TripEventDaysView();
    this._tripNoEventsComponent = new TripNoEventsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(destination, events) {
    this._tripEvents = events.slice();
    this._tripDestination = destination;
    this._sourcedTaskEvents = events.slice();

    this._renderEvents();
  }

  _renderEvents() {
    if (this._tripEvents.length === 0) {
      this._renderNoTripEvents();
      return;
    }

    this._renderTripSort();
    this._renderTripEventDaysContainer();
    this._renderTripEventDays();
  }

  _renderNoTripEvents() {
    render(this._tripEventContainer, this._tripNoEventsComponent, InsertPosition.BEFOREEND);
  }

  _sortTripEvents(sortType) {
    switch (sortType) {
      case SortType.EVENT:
        // this._tripEvents.sort(sortTypeEvent);
        this._tripEvents = this._sourcedTaskEvents.slice();
        break;
      case SortType.TIME:
        this._tripEvents.sort(sortTypeTime);
        break;
      case SortType.PRICE:
        this._tripEvents.sort(sortTypePrice);
        break;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTripEvents(sortType);
    this._clearTripEventsList();

    if (sortType === `event`) {
      this._renderTripEventDays();
      return;
    }

    this._renderEventsWithoutDays();
  }

  _renderTripSort() {
    render(this._tripEventContainer, this._tripSortComponent, InsertPosition.BEFOREEND);

    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearTripEventsList() {
    this._tripEventDaysComponent.element.innerHTML = ``;
  }

  _renderTripEventDaysContainer() {
    render(this._tripEventContainer, this._tripEventDaysComponent, InsertPosition.BEFOREEND);
  }

  _renderTripEventPresenter(tripEventsListContainer, events) {
    const tripEventPresenter = new TripEventPresenter(tripEventsListContainer);
    tripEventPresenter.init(this._tripDestination, events);
  }

  _renderTripEventDays() {
    const groupSeparatedEvents = separateEventsIntoDays(this._tripEvents);

    Object.keys(groupSeparatedEvents).forEach((oneDay, dayId) => {
      const eventDay = (formatDate) => moment(oneDay).format(formatDate);
      const tripEventsListComponent = new TripEventListView(dayId + 1, eventDay, groupSeparatedEvents[oneDay]);

      render(this._tripEventDaysComponent, tripEventsListComponent, InsertPosition.BEFOREEND);

      groupSeparatedEvents[oneDay].forEach((event) => {
        this._renderTripEventPresenter(tripEventsListComponent.getEventListContainer(), event);
      });
    });
  }

  _renderEventsWithoutDays() {
    const tripEventsListComponent = new TripEventListView(null, null);
    render(this._tripEventDaysComponent, tripEventsListComponent, InsertPosition.BEFOREEND);

    this._tripEvents.forEach((event) => {
      this._renderTripEventPresenter(tripEventsListComponent.getEventListContainer(), event);
    });
  }

}
