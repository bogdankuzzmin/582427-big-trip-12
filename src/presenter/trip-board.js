import moment from "moment";
import {render, remove} from "../utils/render.js";
import {separateEventsIntoDays} from "../utils/event.js";
import {InsertPosition, SortType, UpdateType, UserAction} from "../const.js";

import TripEventPresenter from "./trip-event.js";

import TripEventListView from "../view/trip-event-list.js";
import TripEventDaysView from "../view/trip-event-days.js";
import TripNoEventsView from "../view/trip-no-events.js";
import TripSortView from "../view/trip-sort.js";

import {sortTypeTime, sortTypePrice, sortTypeEvent} from "../utils/sort.js";

export default class Trip {
  constructor(tripEventContainer, eventsModel) {
    this._tripEventContainer = tripEventContainer;
    this._eventsModel = eventsModel;
    this._currentSortType = SortType.EVENT;
    this._tripEventPresenter = {};
    this._tripDaysStorage = {};

    this._tripSortComponent = null;

    this._tripEventDaysComponent = new TripEventDaysView();
    this._tripNoEventsComponent = new TripNoEventsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init(destination, offers) {
    this._tripDestination = destination;
    this._offers = offers;

    this._renderEvents();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.EVENT:
        return this._eventsModel.getEvents().slice().sort(sortTypeEvent);
      case SortType.TIME:
        return this._eventsModel.getEvents().slice().sort(sortTypeTime);
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort(sortTypePrice);
    }

    return this._eventsModel.getEvents();
  }

  _handleModeChange() {
    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    // console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripEventPresenter[data.id].init(this._tripDestination, data, this._offers);
        break;
      case UpdateType.MAJOR:
        this._clearTripEventsList();
        this._renderEvents();
        break;
    }
  }

  _renderEvents() {
    if (this._getEvents().length === 0) {
      this._renderNoTripEvents();
      return;
    }

    this._renderTripSort();
    this._renderTripEventDaysContainer();

    if (this._currentSortType === `event`) {
      this._renderTripEventDays();
      return;
    }

    this._renderEventsWithoutDays();
  }

  _renderNoTripEvents() {
    render(this._tripEventContainer, this._tripNoEventsComponent, InsertPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripEventsList();
    this._renderEvents();
  }

  _renderTripSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventContainer, this._tripSortComponent, InsertPosition.BEFOREEND);
  }

  _clearTripEventsList() {
    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.destroy());

    Object
      .values(this._tripDaysStorage)
      .forEach((day) => remove(day));

    this._tripEventPresenter = {};
    this._tripDaysStorage = {};

    remove(this._tripNoEventsComponent);
    remove(this._tripSortComponent);
    remove(this._tripEventDaysComponent);
  }

  _renderTripEventDaysContainer() {
    render(this._tripEventContainer, this._tripEventDaysComponent, InsertPosition.BEFOREEND);
  }

  _renderTripEventPresenter(tripEventsListContainer, events) {
    const tripEventPresenter = new TripEventPresenter(tripEventsListContainer, this._handleViewAction, this._handleModeChange);
    tripEventPresenter.init(this._tripDestination, events, this._offers);
    this._tripEventPresenter[events.id] = tripEventPresenter;
  }

  _renderTripEventDays() {
    const events = this._getEvents().slice();
    const groupSeparatedEvents = separateEventsIntoDays(events);

    Object.keys(groupSeparatedEvents).forEach((oneDay, dayId) => {
      const eventDay = (formatDate) => moment(oneDay).format(formatDate);
      const tripEventsListComponent = new TripEventListView(dayId + 1, eventDay, groupSeparatedEvents[oneDay]);
      render(this._tripEventDaysComponent, tripEventsListComponent, InsertPosition.BEFOREEND);
      this._tripDaysStorage[oneDay] = tripEventsListComponent;

      groupSeparatedEvents[oneDay].forEach((event) => {
        this._renderTripEventPresenter(tripEventsListComponent.getEventListContainer(), event);
      });
    });
  }

  _renderEventsWithoutDays() {
    const tripEventsListComponent = new TripEventListView(null, null);
    render(this._tripEventDaysComponent, tripEventsListComponent, InsertPosition.BEFOREEND);
    this._tripDaysStorage[`oneDay`] = tripEventsListComponent;

    const events = this._getEvents().slice();

    events.forEach((event) => {
      this._renderTripEventPresenter(tripEventsListComponent.getEventListContainer(), event);
    });
  }

}
